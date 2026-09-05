import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

// The local Gemini secret lives beside this server file, outside source control.
dotenv.config({ path: new URL('.env', import.meta.url) });

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (serviceAccountJson) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(serviceAccountJson)) });
} else {
  console.warn('Firebase Admin is not configured; authenticated analysis is unavailable.');
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

async function requireFirebaseUser(req, res, next) {
  if (!admin.apps.length) return res.status(503).json({ error: 'AI server authentication is not configured.' });
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: '로그인이 필요합니다.' });
  try {
    req.firebaseUser = await admin.auth().verifyIdToken(token);
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
      : '가장 최근 운동 세션만 대상으로 세트 구성, 운동 순서, 강도, 볼륨, 예상 운동시간을 분석해.';

    const prompt = `너는 전문 웨이트 트레이닝 코치야. 다음 운동 기록을 분석해서 한국어로 피드백을 줘.
    분석 범위: ${analysisScope}
    기록의 startedAt/endedAt 간격은 사용자가 기록을 시작하고 저장한 시각일 뿐 실제 운동 시간으로 해석하지 마.
    estimatedTrainingDurationMinutes가 있으면 그것을 일반적인 세트 수·종목 전환·휴식 시간을 반영한 운동시간으로 사용해. 신체 프로필을 분석에 반영해.
    반드시 다음 형식을 엄격히 지켜서 JSON으로만 답해줘. (마크다운 기호 없이 순수 JSON만)
    {"summary": "오늘의 총평", "good": "잘한 점", "bad": "개선할 점"}
    
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

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 서버가 gemini-3.6-flash 모델을 사용하여 LAN http://0.0.0.0:${PORT} 에서 작동 중!`);
});
