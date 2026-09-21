import { Check, ChevronDown, Trash2, X } from 'lucide-react'
import { createSet, type Exercise, type LoadState, type SetRecord } from '../domain/workout'

const stateLabels: Record<LoadState, string> = {
  bodyweight: '맨몸',
  external_load: '외부 중량',
  added_weight: '추가 중량',
  assisted: '보조 중량',
  band_assisted: '밴드 보조',
  band_resisted: '밴드 저항'
}

const numericValue = (value: string) => value === '' ? null : Math.max(0, Number(value))

type Props = {
  exercise: Exercise
  dark: boolean
  onChange: (exercise: Exercise) => void
  onDelete: () => void
}

export function ExerciseCard({ exercise, dark, onChange, onDelete }: Props) {
  const update = (index: number, patch: Partial<SetRecord>) => onChange({
    ...exercise,
    sets: exercise.sets.map((set, setIndex) => setIndex === index ? { ...set, ...patch } : set)
  })
  const removeSet = (index: number) => onChange({
    ...exercise,
    sets: exercise.sets.filter((_, setIndex) => setIndex !== index).map((set, setIndex) => ({ ...set, setIndex: setIndex + 1 }))
  })

  return (
    <article className={`rounded-3xl p-5 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
      <div className="mb-4 flex justify-between">
        <div>
          <h2 className="font-black text-[#ADFF2F]">{exercise.nameSnapshot}</h2>
          <p className="text-xs text-gray-500">{exercise.laterality === 'unilateral' ? '한쪽 기준' : ''}{exercise.implementMultiplier === 2 ? ' · 덤벨 1개 기준' : ''}</p>
        </div>
        <button onClick={onDelete}><Trash2 size={17} className="text-gray-400" /></button>
      </div>
      {exercise.sets.map((set, index) => {
        const loadKey: 'weightKg' | 'addedWeightKg' | 'assistedWeightKg' | null = exercise.recordType === 'assisted_weight_reps'
          ? 'assistedWeightKg'
          : exercise.recordType === 'bodyweight_added_weight_reps' && set.loadState === 'added_weight'
            ? 'addedWeightKg'
            : (exercise.recordType === 'weight_reps' || exercise.recordType === 'weight_time') ? 'weightKg' : null
        const changeLoad = (raw: string) => {
          const inputLoadValue = numericValue(raw)
          const kg = inputLoadValue === null ? null : inputLoadValue * (set.inputLoadUnit === 'lb' ? 0.45359237 : 1)
          update(index, { inputLoadValue, [loadKey!]: kg } as Partial<SetRecord>)
        }
        const changeUnit = (unit: 'kg' | 'lb') => {
          const canonical = loadKey ? set[loadKey] : null
          const inputLoadValue = canonical === null ? null : canonical / (unit === 'lb' ? 0.45359237 : 1)
          update(index, { inputLoadUnit: unit, inputLoadValue, [loadKey!]: canonical } as Partial<SetRecord>)
        }
        const hasReps = ['weight_reps', 'assisted_weight_reps', 'bodyweight_added_weight_reps', 'reps_only'].includes(exercise.recordType)
        const hasDuration = exercise.recordType === 'time' || exercise.recordType === 'weight_time'
        return (
          <div key={set.sourceSetId} className="mb-3 rounded-2xl bg-black/10 p-3">
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span>SET {index + 1}</span>
              <span className="flex gap-1">
                <button onClick={() => update(index, { completed: !set.completed })} className={set.completed ? 'text-[#ADFF2F]' : 'text-gray-400'}><Check size={18} /></button>
                <button aria-label="세트 삭제" onClick={() => removeSet(index)} className="text-red-400"><X size={18} /></button>
              </span>
            </div>
            {exercise.allowedLoadStates.length > 1 && (
              <select value={set.loadState} onChange={(event) => update(index, { loadState: event.target.value as LoadState, inputLoadValue: null, inputLoadUnit: 'kg', weightKg: null, addedWeightKg: null, assistedWeightKg: null })} className="mb-2 w-full rounded-lg bg-black/10 p-2 text-xs">
                {exercise.allowedLoadStates.map((state) => <option key={state} value={state}>{stateLabels[state]}</option>)}
              </select>
            )}
            <div style={loadKey ? { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 64px minmax(0, 1fr)', gap: '0.5rem' } : undefined} className={loadKey ? 'grid' : 'grid grid-cols-1 gap-2'}>
              {loadKey && <>
                <input type="number" min="0" placeholder={set.inputLoadUnit === 'lb' ? 'LB' : 'KG'} value={set.inputLoadValue ?? (set[loadKey] ?? '')} onChange={(event) => changeLoad(event.target.value)} className="min-w-0 rounded-xl bg-black/10 p-3 text-center text-sm outline-none" />
                <span className="relative">
                  <select value={set.inputLoadUnit || 'kg'} onChange={(event) => changeUnit(event.target.value as 'kg' | 'lb')} style={{ appearance: 'none', WebkitAppearance: 'none' }} className="h-full w-full cursor-pointer rounded-xl bg-black/10 py-3 pl-3 pr-7 text-sm font-black text-[#ADFF2F] outline-none">
                    <option className="bg-[#1e1e1e] text-white" value="kg">kg</option>
                    <option className="bg-[#1e1e1e] text-white" value="lb">lb</option>
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#ADFF2F]" />
                </span>
              </>}
              {hasReps && <input type="number" min="0" placeholder="REPS" value={set.reps ?? ''} onChange={(event) => update(index, { reps: numericValue(event.target.value) })} className="min-w-0 rounded-xl bg-black/10 p-3 text-center text-sm outline-none" />}
              {hasDuration && <input type="number" min="0" placeholder="초" value={set.durationSeconds ?? ''} onChange={(event) => update(index, { durationSeconds: numericValue(event.target.value) })} className="min-w-0 rounded-xl bg-black/10 p-3 text-center text-sm outline-none" />}
            </div>
          </div>
        )
      })}
      <button onClick={() => onChange({ ...exercise, sets: [...exercise.sets, createSet(exercise, exercise.sets.length + 1)] })} className="w-full rounded-xl border border-gray-500/30 py-2 text-xs font-bold text-gray-400">+ SET</button>
    </article>
  )
}
