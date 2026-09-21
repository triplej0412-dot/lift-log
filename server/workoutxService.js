import fs from 'node:fs';

const lookupCache = new Map();
const aliases = new Map();

try {
  const auditFile = new URL('../tools/exercise-audit/coverage-result.json', import.meta.url);
  const audit = JSON.parse(fs.readFileSync(auditFile, 'utf8'));
  for (const row of audit.rows || []) {
    const candidates = [row.freeExerciseDb, row.repDb]
      .filter((candidate) => candidate?.status !== 'unmatched' && candidate?.candidateName)
      .sort((a, b) => {
        const rank = (candidate) => (candidate.status === 'exact' ? 10 : 0) + Number(candidate.score || 0);
        return rank(b) - rank(a);
      })
      .map((candidate) => candidate.candidateName);
    if (candidates.length) aliases.set(row.presetId, [...new Set(candidates)]);
  }
  console.log(`Loaded WorkoutX fallback aliases for ${aliases.size} catalog exercises.`);
} catch (error) {
  console.warn('WorkoutX alias audit was not available:', error.message);
}

function normalizeExerciseName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\b(with|and|the|a|an)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function candidateScore(targetName, targetEquipment, candidate) {
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

function workoutxItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.exercises)) return payload.exercises;
  return [];
}

async function searchExercises(name, apiKey) {
  const headers = { 'X-WorkoutX-Key': apiKey };
  const listResponse = await fetch(`https://api.workoutxapp.com/v1/exercises?name=${encodeURIComponent(name)}&limit=20`, { headers });
  if (!listResponse.ok) throw new Error(`WorkoutX 조회 실패 (${listResponse.status})`);
  const listItems = workoutxItems(await listResponse.json());
  if (listItems.length) return listItems;
  const nameResponse = await fetch(`https://api.workoutxapp.com/v1/exercises/name/${encodeURIComponent(name)}`, { headers });
  if (nameResponse.status === 404) return [];
  if (!nameResponse.ok) throw new Error(`WorkoutX 이름 검색 실패 (${nameResponse.status})`);
  return workoutxItems(await nameResponse.json());
}

export async function findExerciseMedia({ name, equipment, presetId, apiKey }) {
  const cacheKey = `${presetId || name}|${equipment}`;
  const cached = lookupCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const searchNames = [...new Set([...(aliases.get(presetId) || []), name])];
  let match = null;
  let matchedQuery = name;
  for (const query of searchNames) {
    const items = await searchExercises(query, apiKey);
    const candidate = [...items].sort((a, b) => candidateScore(query, equipment, b) - candidateScore(query, equipment, a))[0] || null;
    if (candidate?.id) {
      match = candidate;
      matchedQuery = query;
      break;
    }
  }
  if (!match?.id) return null;
  const detailResponse = await fetch(`https://api.workoutxapp.com/v1/exercises/exercise/${encodeURIComponent(match.id)}`, { headers: { 'X-WorkoutX-Key': apiKey } });
  if (!detailResponse.ok) throw new Error(`WorkoutX 상세 조회 실패 (${detailResponse.status})`);
  const candidate = await detailResponse.json();
  const gifUrl = String(candidate.gifUrl || '');
  if (!gifUrl) return null;
  const value = {
    id: candidate.id,
    name: candidate.name,
    gifPath: `/api/exercise-gif/${encodeURIComponent(candidate.id)}?source=${encodeURIComponent(gifUrl)}`,
    matchedExactly: normalizeExerciseName(name) === normalizeExerciseName(candidate.name),
    matchedQuery
  };
  lookupCache.set(cacheKey, { value, expiresAt: Date.now() + 6 * 60 * 60 * 1000 });
  return value;
}

export async function fetchExerciseGif(id, suppliedUrl, apiKey) {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    const error = new Error('잘못된 운동 ID입니다.');
    error.status = 400;
    throw error;
  }
  const source = new URL(suppliedUrl || `https://api.workoutxapp.com/v1/gifs/${encodeURIComponent(id)}`);
  if (!['api.workoutxapp.com', 'cdn.workoutxapp.com'].includes(source.hostname) || source.protocol !== 'https:') {
    const error = new Error('허용되지 않은 GIF 주소입니다.');
    error.status = 400;
    throw error;
  }
  const upstream = await fetch(source, { headers: { 'X-WorkoutX-Key': apiKey } });
  if (!upstream.ok) throw new Error(`WorkoutX GIF 조회 실패 (${upstream.status})`);
  return { contentType: upstream.headers.get('content-type') || 'image/gif', body: Buffer.from(await upstream.arrayBuffer()) };
}
