const MAX_WORKOUTS = 500;
const MAX_EXERCISES = 100;
const MAX_SETS = 100;
const MAX_TEXT_LENGTH = 2_000;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function optionalNumber(value, { min, max }) {
  if (value === null || value === undefined || value === '') return true;
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) && numeric >= min && numeric <= max;
}

function validateTextFields(value) {
  if (typeof value === 'string') return value.length <= MAX_TEXT_LENGTH;
  if (Array.isArray(value)) return value.every(validateTextFields);
  if (isObject(value)) return Object.values(value).every(validateTextFields);
  return true;
}

function validateSet(set) {
  if (!isObject(set)) return '각 세트는 객체여야 합니다.';
  const loadFields = ['weightKg', 'addedWeightKg', 'assistedWeightKg', 'inputLoadValue'];
  if (loadFields.some((field) => !optionalNumber(set[field], { min: 0, max: 2_000 }))) {
    return '중량은 0~2000 범위의 숫자여야 합니다.';
  }
  if (!optionalNumber(set.reps, { min: 0, max: 10_000 })) return '반복 수가 올바르지 않습니다.';
  if (!optionalNumber(set.durationSeconds, { min: 0, max: 86_400 })) return '운동 시간이 올바르지 않습니다.';
  if (set.inputLoadUnit !== undefined && !['kg', 'lb'].includes(set.inputLoadUnit)) {
    return '중량 단위는 kg 또는 lb여야 합니다.';
  }
  return null;
}

function validateWorkout(workout) {
  if (!isObject(workout)) return '운동 기록은 객체여야 합니다.';
  if (!Array.isArray(workout.exercises)) return '운동 기록의 exercises는 배열이어야 합니다.';
  if (workout.exercises.length > MAX_EXERCISES) return `한 기록에는 운동을 ${MAX_EXERCISES}개까지 보낼 수 있습니다.`;
  for (const exercise of workout.exercises) {
    if (!isObject(exercise)) return '각 운동은 객체여야 합니다.';
    if (!Array.isArray(exercise.sets)) return '각 운동의 sets는 배열이어야 합니다.';
    if (exercise.sets.length > MAX_SETS) return `한 운동에는 세트를 ${MAX_SETS}개까지 보낼 수 있습니다.`;
    for (const set of exercise.sets) {
      const error = validateSet(set);
      if (error) return error;
    }
  }
  return null;
}

export function validateAnalysisRequest(body) {
  if (!isObject(body)) return '요청 본문은 JSON 객체여야 합니다.';
  const { workoutData, analysisMode = 'latest' } = body;
  if (!['latest', 'cumulative'].includes(analysisMode)) return 'analysisMode는 latest 또는 cumulative여야 합니다.';
  if (!isObject(workoutData)) return 'workoutData가 필요합니다.';
  if (!validateTextFields(workoutData)) return `텍스트 필드는 ${MAX_TEXT_LENGTH}자를 넘을 수 없습니다.`;

  if (workoutData.profile !== undefined) {
    if (!isObject(workoutData.profile)) return 'profile은 객체여야 합니다.';
    if (!optionalNumber(workoutData.profile.heightCm, { min: 50, max: 300 })) return '키는 50~300cm 범위여야 합니다.';
    if (!optionalNumber(workoutData.profile.weightKg, { min: 10, max: 500 })) return '몸무게는 10~500kg 범위여야 합니다.';
  }

  if (workoutData.estimatedTrainingDurationMinutes !== undefined
    && !optionalNumber(workoutData.estimatedTrainingDurationMinutes, { min: 0, max: 1_440 })) {
    return '예상 운동 시간은 0~1440분 범위여야 합니다.';
  }

  if (analysisMode === 'latest') {
    const error = validateWorkout(workoutData.latestWorkout);
    if (error) return error;
  } else {
    if (!Array.isArray(workoutData.workoutHistory) || workoutData.workoutHistory.length === 0) {
      return '누적 분석에는 비어 있지 않은 workoutHistory가 필요합니다.';
    }
    if (workoutData.workoutHistory.length > MAX_WORKOUTS) return `누적 분석은 최근 ${MAX_WORKOUTS}개 기록까지 지원합니다.`;
    for (const workout of workoutData.workoutHistory) {
      const error = validateWorkout(workout);
      if (error) return error;
    }
  }

  return null;
}
