import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// The local Gemini secret lives beside this server file, outside source control.
dotenv.config({ path: new URL('.env', import.meta.url) });

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const WORKOUTX_API_KEY = process.env.WORKOUTX_API_KEY;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const workoutxLookupCache = new Map();

if (serviceAccountJson) {
  initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
} else {
  console.warn('Firebase Admin is not configured; authenticated analysis is unavailable.');
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

async function requireFirebaseUser(req, res, next) {
  if (!getApps().length) return res.status(503).json({ error: 'AI server authentication is not configured.' });
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: '로그인이 필요합니다.' });
  try {
    req.firebaseUser = await getAuth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ error: '로그인 인증이 만료되었거나 유효하지 않습니다.' });
  }
}

app.post('/api/analyze', requireFirebaseUser, async (req, res) => {
  try {
    const { workoutData, analysisMode = 'latest' } = req.body;

    // [모델명 변경] gemini-2.5-flash -> gemini-3.6-flash
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;

    const analysisScope = analysisMode === 'cumulative'
      ? '전체 누적 기록을 대상으로 운동 빈도, 부위·종목 분배, 중량·반복 추세, 회복과 일관성을 분석해. workoutHistory의 모든 세션을 반드시 검토하고, 최신 1회 기록이나 오늘 운동만 설명하지 마. 총 세션 수와 기록 기간을 총평에 명시해.'
      : '가장 최근 운동 세션을 중심으로 분석하되, workoutHistory 또는 cumulativeSummary가 제공되면 최근 누적 운동 목록·운동 날짜·부위 분배를 함께 참고해. 마지막에는 다음 운동에서 보완하면 좋은 신체 부위를 1~2개 추천하고, 그 이유와 어울리는 운동 예시를 짧게 알려줘.';

    const prompt = `너는 전문 웨이트 트레이닝 코치야. 다음 운동 기록을 분석해서 한국어로 피드백을 줘.
    분석 범위: ${analysisScope}
    기록의 startedAt/endedAt 간격은 사용자가 기록을 시작하고 저장한 시각일 뿐 실제 운동 시간으로 해석하지 마.
    estimatedTrainingDurationMinutes가 있으면 그것을 일반적인 세트 수·종목 전환·휴식 시간을 반영한 운동시간으로 사용해. 신체 프로필을 분석에 반영해.
    반드시 다음 형식을 엄격히 지켜서 JSON으로만 답해줘. (마크다운 기호 없이 순수 JSON만)
    {"summary": "오늘의 총평", "good": "잘한 점", "bad": "개선할 점", "nextFocus": "다음 운동 추천 부위와 이유·운동 예시"}
    
    기록: ${JSON.stringify(workoutData)}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Google API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // 결과 텍스트 추출 및 JSON 변환
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        res.json(JSON.parse(jsonMatch[0]));
      } else {
        res.status(500).json({ error: "분석 형식이 올바르지 않습니다." });
      }
    } else {
      res.status(500).json({ error: "AI 응답을 생성하지 못했습니다." });
    }

  } catch (error) {
    console.error("❌ 서버 내부 에러:", error.message);
    res.status(500).json({ error: "AI 분석 중 오류가 발생했습니다." });
  }
});

function normalizeExerciseName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\b(with|and|the|a|an)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function workoutxCandidateScore(targetName, targetEquipment, candidate) {
  const target = normalizeExerciseName(targetName);
  const name = normalizeExerciseName(candidate.name);
  if (target === name) return 100;
  const targetTokens = new Set(target.split(' '));
  const candidateTokens = new Set(name.split(' '));
  const overlap = [...targetTokens].filter((token) => candidateTokens.has(token)).length;
  let score = overlap / Math.max(targetTokens.size, candidateTokens.size, 1) * 10;
  if (name.includes(target) || target.includes(name)) score += 5;
  if (targetEquipment && normalizeExerciseName(candidate.equipment).includes(normalizeExerciseName(targetEquipment))) score += 3;
  return score;
}

app.get('/api/exercise-media', requireFirebaseUser, async (req, res) => {
  const name = String(req.query.name || '').trim();
  const equipment = String(req.query.equipment || '').trim();
  if (!WORKOUTX_API_KEY) return res.status(503).json({ error: 'WorkoutX API 키가 서버에 설정되지 않았습니다.' });
  if (!name) return res.status(400).json({ error: '운동 이름이 필요합니다.' });
  const cacheKey = `${name}|${equipment}`;
  const cached = workoutxLookupCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return res.json(cached.value);
  try {
    // WorkoutX name search is a path endpoint. The older query-string form simply
    // returned an unrelated first page, so valid catalog exercises appeared to have no GIF.
    const upstream = await fetch(`https://api.workoutxapp.com/v1/exercises/name/${encodeURIComponent(name)}?limit=10`, {
      headers: { 'X-WorkoutX-Key': WORKOUTX_API_KEY }
    });
    if (!upstream.ok) return res.status(502).json({ error: `WorkoutX 조회 실패 (${upstream.status})` });
    const items = await upstream.json();
    const candidate = Array.isArray(items) ? [...items].sort((a, b) => workoutxCandidateScore(name, equipment, b) - workoutxCandidateScore(name, equipment, a))[0] : null;
    if (!candidate?.id || !candidate?.gifUrl) return res.status(404).json({ error: 'GIF가 있는 운동을 찾지 못했습니다.' });
    const gifUrl = String(candidate.gifUrl || '');
    if (!gifUrl) return res.status(404).json({ error: 'GIF가 있는 운동을 찾지 못했습니다.' });
    const value = {
      id: candidate.id,
      name: candidate.name,
      gifPath: `/api/exercise-gif/${encodeURIComponent(candidate.id)}?source=${encodeURIComponent(gifUrl)}`,
      matchedExactly: normalizeExerciseName(name) === normalizeExerciseName(candidate.name)
    };
    workoutxLookupCache.set(cacheKey, { value, expiresAt: Date.now() + 6 * 60 * 60 * 1000 });
    res.json(value);
  } catch (error) {
    console.error('WorkoutX lookup failed:', error.message);
    res.status(502).json({ error: 'WorkoutX 연결에 실패했습니다.' });
  }
});

app.get('/api/exercise-gif/:id', requireFirebaseUser, async (req, res) => {
  if (!WORKOUTX_API_KEY) return res.status(503).send('WorkoutX API 키가 서버에 설정되지 않았습니다.');
  const id = String(req.params.id || '');
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return res.status(400).send('잘못된 운동 ID입니다.');
  try {
    const suppliedUrl = String(req.query.source || '');
    const source = new URL(suppliedUrl || `https://api.workoutxapp.com/v1/gifs/${encodeURIComponent(id)}`);
    // Only proxy GIFs served by WorkoutX. This keeps the authenticated proxy from
    // becoming an open server-side request endpoint.
    if (!['api.workoutxapp.com', 'cdn.workoutxapp.com'].includes(source.hostname) || source.protocol !== 'https:') {
      return res.status(400).send('허용되지 않은 GIF 주소입니다.');
    }
    const upstream = await fetch(source, {
      headers: { 'X-WorkoutX-Key': WORKOUTX_API_KEY }
    });
    if (!upstream.ok) return res.status(502).send(`WorkoutX GIF 조회 실패 (${upstream.status})`);
    res.set('Content-Type', upstream.headers.get('content-type') || 'image/gif');
    res.set('Cache-Control', 'private, max-age=604800');
    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    console.error('WorkoutX GIF fetch failed:', error.message);
    res.status(502).send('WorkoutX GIF 연결에 실패했습니다.');
  }
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 서버가 gemini-3.6-flash 모델을 사용하여 LAN http://0.0.0.0:${PORT} 에서 작동 중!`);
});
