// Keep the HTTP request comfortably below the mobile/hosting proxy timeout.
// A second model is a better recovery path than waiting on a busy model.
const REQUEST_TIMEOUT_MS = 5_500;
const ANALYSIS_BUDGET_MS = 18_000;
const FORMAT_RETRY_BUDGET_MS = 4_500;
const MAX_RECENT_SESSIONS = 60;
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export class GeminiAnalysisError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

function candidateText(data) {
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n').trim() || '';
}

function parseAnalysisJson(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Object.values(parsed).some((value) => String(value || '').trim())) return null;
    return {
      summary: String(parsed.summary || ''),
      good: String(parsed.good || ''),
      bad: String(parsed.bad || ''),
      nextFocus: String(parsed.nextFocus || '')
    };
  } catch {
    return null;
  }
}

function isTransientGeminiError(data, responseStatus) {
  const code = Number(data?.error?.code || responseStatus || 0);
  const message = String(data?.error?.message || '').toLowerCase();
  return [429, 500, 502, 503, 504].includes(code) || /high demand|overload|temporar|unavailable|rate limit|timeout/.test(message);
}

async function postJsonWithTimeout(url, payload, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } finally {
    clearTimeout(timer);
  }
}

async function generateGeminiWithRetry(url, payload, { budgetMs = ANALYSIS_BUDGET_MS, attempts = 1 } = {}) {
  const deadline = Date.now() + budgetMs;
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const remaining = deadline - Date.now();
    if (remaining < 1_000) break;
    try {
      const { response, data } = await postJsonWithTimeout(url, payload, Math.min(REQUEST_TIMEOUT_MS, remaining));
      if (!data.error) return data;
      if (!isTransientGeminiError(data, response.status)) {
        throw new GeminiAnalysisError(data.error.message || 'Gemini 요청이 거부되었습니다.', response.status >= 400 && response.status < 500 ? response.status : 502);
      }
      lastError = new GeminiAnalysisError('AI 서비스가 혼잡합니다. 잠시 후 다시 시도해주세요.', 503);
    } catch (error) {
      if (error instanceof GeminiAnalysisError && error.status !== 503) throw error;
      lastError = error?.name === 'AbortError'
        ? new GeminiAnalysisError('AI 응답 시간이 길어 요청을 중단했습니다. 잠시 후 다시 시도해주세요.', 504)
        : error instanceof GeminiAnalysisError
          ? error
          : new GeminiAnalysisError('AI 분석 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 502);
    }
    if (attempt < attempts - 1 && deadline - Date.now() > 1_500) {
      const delay = Math.min(500 + Math.floor(Math.random() * 250), deadline - Date.now() - 500);
      console.warn(`Gemini transient failure; retrying once in ${delay}ms.`);
      await sleep(delay);
    }
  }
  throw lastError || new GeminiAnalysisError('AI 분석 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.', 504);
}

function modelCandidates(primaryModel) {
  // Render may still have an old GEMINI_MODEL value. Keep it as the first
  // choice, but do not let a busy legacy model make the whole request fail.
  const preferred = [
    'gemini-3.5-flash-lite',
    // This alias was verified with this project's API key and is the most
    // broadly available stable Flash route for the production service.
    'gemini-flash-latest',
    'gemini-flash-lite-latest'
  ];
  // Do not spend most of the request budget on the previously unstable model
  // when an old Render environment variable still points at it.
  const candidates = primaryModel === 'gemini-3.6-flash'
    ? preferred
    : [primaryModel, ...preferred];
  return [...new Set(candidates.filter(Boolean))];
}

async function generateWithModelFallback(payload, apiKey, primaryModel, budgetMs = ANALYSIS_BUDGET_MS) {
  const deadline = Date.now() + budgetMs;
  const models = modelCandidates(primaryModel);
  let lastError;

  for (let index = 0; index < models.length; index += 1) {
    const remaining = deadline - Date.now();
    if (remaining < 1_500) break;
    const model = models[index];
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
    try {
      const data = await generateGeminiWithRetry(apiUrl, payload, {
        budgetMs: Math.min(REQUEST_TIMEOUT_MS, remaining),
        attempts: 1
      });
      return { data, model };
    } catch (error) {
      lastError = error;
      // API key / permission / malformed request issues cannot be improved by
      // selecting another model, so return the actionable error immediately.
      if (!(error instanceof GeminiAnalysisError) || ![502, 503, 504].includes(error.status)) throw error;
      console.warn(`Gemini model ${model} unavailable; trying fallback model.`);
    }
  }
  throw lastError || new GeminiAnalysisError('AI 분석 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.', 504);
}

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

function compactExercise(exercise) {
  const sets = Array.isArray(exercise?.sets) ? exercise.sets : [];
  return {
    name: exercise?.nameSnapshot || exercise?.nameKo || '이름 없는 운동',
    part: exercise?.defaultUiPart || 'unknown',
    setCount: sets.length,
    completedSetCount: sets.filter((set) => set?.completed !== false).length,
    totalReps: sets.reduce((sum, set) => sum + asNumber(set?.reps), 0),
    volumeKg: Math.round(sets.reduce((sum, set) => {
      const load = asNumber(set?.weightKg ?? set?.addedWeightKg ?? set?.assistedWeightKg);
      return sum + load * asNumber(set?.reps);
    }, 0) * 10) / 10
  };
}

function compactWorkout(workout) {
  const exercises = Array.isArray(workout?.exercises) ? workout.exercises.map(compactExercise) : [];
  return {
    date: workout?.startedAt || workout?.date || '',
    title: workout?.title || '',
    estimatedTrainingDurationMinutes: workout?.estimatedTrainingDurationMinutes || null,
    exercises,
    setCount: exercises.reduce((sum, exercise) => sum + exercise.setCount, 0),
    volumeKg: Math.round(exercises.reduce((sum, exercise) => sum + exercise.volumeKg, 0) * 10) / 10
  };
}

export function prepareAnalysisData(workoutData, analysisMode) {
  if (analysisMode !== 'cumulative') {
    return {
      profile: workoutData.profile || {},
      latestWorkout: compactWorkout(workoutData.latestWorkout),
      cumulativeSummary: workoutData.cumulativeSummary || null
    };
  }

  const history = Array.isArray(workoutData.workoutHistory) ? workoutData.workoutHistory : [];
  const workouts = history.map(compactWorkout);
  const partStats = new Map();
  const exerciseStats = new Map();
  const monthlyStats = new Map();
  for (const workout of workouts) {
    const month = String(workout.date).slice(0, 7) || 'unknown';
    const monthly = monthlyStats.get(month) || { month, sessions: 0, sets: 0, volumeKg: 0 };
    monthly.sessions += 1;
    monthly.sets += workout.setCount;
    monthly.volumeKg += workout.volumeKg;
    monthlyStats.set(month, monthly);
    for (const exercise of workout.exercises) {
      const part = partStats.get(exercise.part) || { part: exercise.part, sessions: 0, sets: 0, volumeKg: 0 };
      part.sessions += 1;
      part.sets += exercise.setCount;
      part.volumeKg += exercise.volumeKg;
      partStats.set(exercise.part, part);
      const key = `${exercise.name}|${exercise.part}`;
      const stat = exerciseStats.get(key) || { name: exercise.name, part: exercise.part, sessions: 0, sets: 0, reps: 0, volumeKg: 0 };
      stat.sessions += 1;
      stat.sets += exercise.setCount;
      stat.reps += exercise.totalReps;
      stat.volumeKg += exercise.volumeKg;
      exerciseStats.set(key, stat);
    }
  }
  return {
    profile: workoutData.profile || {},
    cumulativeSummary: {
      workoutCount: workouts.length,
      from: workouts.at(-1)?.date || '',
      to: workouts[0]?.date || '',
      muscleGroupStats: [...partStats.values()],
      exerciseStats: [...exerciseStats.values()].sort((a, b) => b.sets - a.sets).slice(0, 40),
      monthlyStats: [...monthlyStats.values()].sort((a, b) => a.month.localeCompare(b.month)),
      recentSessions: workouts.slice(0, MAX_RECENT_SESSIONS),
      olderSessionCount: Math.max(0, workouts.length - MAX_RECENT_SESSIONS)
    }
  };
}

function analysisPrompt(workoutData, analysisMode) {
  const scope = analysisMode === 'cumulative'
    ? '전체 누적 통계는 모든 기록을 기반으로 계산된 값이고, recentSessions는 최근 세션 상세 요약이다. 둘 다 근거로 운동 빈도, 부위·종목 분배, 중량·반복 추세, 회복과 일관성을 분석해. 최신 1회 기록만 설명하지 마.'
    : '가장 최근 운동 세션을 중심으로 분석하고, 누적 요약이 제공되면 함께 참고해. 마지막에는 다음 운동에서 보완하면 좋은 신체 부위를 1~2개 추천하고, 이유와 운동 예시를 짧게 알려줘.';
  return `너는 전문 웨이트 트레이닝 코치야. 다음의 압축된 운동 기록을 한국어로 분석해.
    분석 범위: ${scope}
    기록의 startedAt/endedAt 간격은 실제 운동 시간으로 해석하지 마. estimatedTrainingDurationMinutes가 있으면 일반적인 세트 수·종목 전환·휴식 시간을 반영한 운동시간으로 사용해.
    반드시 완전한 JSON 객체만 반환해. 각 값은 최대 2문장, 220자 이내로 간결하게 작성해.
    {"summary":"오늘의 총평","good":"잘한 점","bad":"개선할 점","nextFocus":"다음 운동 추천 부위와 이유·운동 예시"}
    기록: ${JSON.stringify(workoutData)}`;
}

export async function analyzeWithGemini(workoutData, analysisMode, apiKey, model) {
  const prompt = analysisPrompt(prepareAnalysisData(workoutData, analysisMode), analysisMode);
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 800, responseMimeType: 'application/json' }
  };
  const initial = await generateWithModelFallback(payload, apiKey, model);
  const data = initial.data;
  const parsed = parseAnalysisJson(candidateText(data));
  if (parsed) return parsed;

  const retryPayload = {
    contents: [{ parts: [{ text: `${prompt}\n응답이 잘리지 않도록 각 항목을 한 문장, 100자 이내로 줄여 완전한 JSON만 반환해.` }] }],
    generationConfig: { temperature: 0.15, maxOutputTokens: 500, responseMimeType: 'application/json' }
  };
  const retry = await generateWithModelFallback(retryPayload, apiKey, initial.model, FORMAT_RETRY_BUDGET_MS);
  const retryParsed = parseAnalysisJson(candidateText(retry.data));
  if (retryParsed) return retryParsed;
  throw new GeminiAnalysisError('AI 분석 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.', 502);
}
