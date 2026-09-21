export type LoadState = 'bodyweight' | 'external_load' | 'added_weight' | 'assisted' | 'band_assisted' | 'band_resisted'
export type RecordType = 'weight_reps' | 'reps_only' | 'time' | 'weight_time' | 'assisted_weight_reps' | 'bodyweight_added_weight_reps'

export type Preset = {
  presetId: string
  canonicalPresetId: string
  storageExerciseId: string
  familyId: string
  nameKo: string
  nameEn: string
  defaultUiPart: string
  recordType: RecordType
  laterality: 'bilateral' | 'unilateral'
  implementMultiplier: number
  canonicalVariantKey: string
  visualVariantKey: string | null
  defaultLoadState: LoadState
  allowedLoadStates: LoadState[]
}

export type SetRecord = {
  sourceSetId: string
  setIndex: number
  loadState: LoadState
  weightKg: number | null
  addedWeightKg: number | null
  assistedWeightKg: number | null
  inputLoadValue: number | null
  inputLoadUnit: 'kg' | 'lb' | null
  reps: number | null
  durationSeconds: number | null
  completed: boolean
  restSeconds: number | null
  rir: number | null
  rpe: number | null
  memo: string | null
}

export type Exercise = Preset & {
  sourceExerciseInstanceId: string
  orderIndex: number
  nameSnapshot: string
  memo: string | null
  sets: SetRecord[]
}

export type Workout = {
  id?: string
  sourceRecordId: string
  status: 'in_progress' | 'completed'
  title: string | null
  startedAt: string
  endedAt: string | null
  memo: string | null
  exercises: Exercise[]
  derivedVolumeKg?: number
}

export const createId = () => crypto.randomUUID()
export const nowIso = () => new Date().toISOString()

export function createSet(preset: Preset, index: number): SetRecord {
  return {
    sourceSetId: createId(),
    setIndex: index,
    loadState: preset.defaultLoadState,
    weightKg: null,
    addedWeightKg: null,
    assistedWeightKg: null,
    inputLoadValue: null,
    inputLoadUnit: 'kg',
    reps: null,
    durationSeconds: null,
    completed: true,
    restSeconds: null,
    rir: null,
    rpe: null,
    memo: null
  }
}

export function createBlankWorkout(): Workout {
  return {
    sourceRecordId: createId(),
    status: 'in_progress',
    title: null,
    startedAt: nowIso(),
    endedAt: null,
    memo: null,
    exercises: []
  }
}

export function calculateVolumeKg(workout: Workout) {
  return workout.exercises.reduce((total, exercise) => total + exercise.sets.reduce((subtotal, set) => {
    if (set.loadState !== 'external_load' || set.weightKg === null || set.reps === null) return subtotal
    const lateralityMultiplier = exercise.laterality === 'unilateral' ? 2 : 1
    return subtotal + set.weightKg * set.reps * exercise.implementMultiplier * lateralityMultiplier
  }, 0), 0)
}

export function estimateTrainingMinutes(workout: Workout) {
  const setCount = workout.exercises.reduce((count, exercise) => count + exercise.sets.length, 0)
  return Math.max(20, Math.ceil((setCount * 2.5 + workout.exercises.length * 3) / 5) * 5)
}

export function toTransferWorkout(workout: Workout) {
  return {
    sourceRecordId: workout.sourceRecordId,
    status: workout.status,
    title: workout.title,
    startedAt: workout.startedAt,
    endedAt: workout.endedAt,
    memo: workout.memo,
    exercises: workout.exercises.map((exercise) => ({
      sourceExerciseInstanceId: exercise.sourceExerciseInstanceId,
      orderIndex: exercise.orderIndex,
      storageExerciseId: exercise.storageExerciseId,
      presetId: exercise.presetId,
      canonicalPresetId: exercise.canonicalPresetId,
      familyId: exercise.familyId,
      canonicalVariantKey: exercise.canonicalVariantKey,
      visualVariantKey: exercise.visualVariantKey,
      nameSnapshot: exercise.nameSnapshot,
      defaultUiPart: exercise.defaultUiPart,
      recordType: exercise.recordType,
      laterality: exercise.laterality,
      implementMultiplier: exercise.implementMultiplier,
      memo: exercise.memo,
      sets: exercise.sets.map((set) => {
        const canonical = set.loadState === 'added_weight'
          ? set.addedWeightKg
          : set.loadState === 'assisted'
            ? set.assistedWeightKg
            : set.weightKg
        return {
          ...set,
          inputLoadValue: set.inputLoadValue ?? canonical,
          inputLoadUnit: set.inputLoadUnit ?? (canonical === null ? null : 'kg')
        }
      })
    }))
  }
}
