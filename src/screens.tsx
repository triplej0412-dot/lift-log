import { Download, Edit2, Moon, Sun, Trash2 } from 'lucide-react'
import { BodyMap } from './components/BodyMap'
import { ExerciseCard } from './components/ExerciseCard'
import { SearchBox } from './components/SearchBox'
import { estimateTrainingMinutes, type Exercise, type Preset, type Workout } from './domain/workout'
import type { Profile, Theme } from './domain/profile'

type InfoProps = {
  activePart: string | null
  onSelectPart: (part: string | null) => void
  search: string
  onSearch: (value: string) => void
  matches: Preset[]
  panel: string
  dark: boolean
  describe: (preset: Preset) => string
}

const partLabels: Record<string, string> = { chest: '가슴', back: '등', legs: '하체', shoulders: '어깨', arms: '팔', abs: '복부' }

export function InfoScreen({ activePart, onSelectPart, search, onSearch, matches, panel, dark, describe }: InfoProps) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-black italic">EXERCISE GUIDE</h1>
      <p className="text-sm text-gray-500">신체 실루엣 또는 부위 텍스트를 누르면 해당 부위 운동을 봅니다.</p>
      <BodyMap active={activePart} onSelect={onSelectPart} />
      <div className="flex items-center justify-between">
        <b className="text-sm">{activePart ? `${partLabels[activePart]} 운동` : '전체 운동'}</b>
        {activePart && <button onClick={() => onSelectPart(null)} className="text-xs text-[#ADFF2F]">전체 보기</button>}
      </div>
      <SearchBox value={search} onChange={onSearch} dark={dark} />
      {matches.map((preset) => (
        <article key={preset.presetId} className={`rounded-3xl p-5 ${panel}`}>
          <h2 className="font-black text-[#ADFF2F]">{preset.nameKo}</h2>
          <p className="mt-1 text-xs text-gray-500">{preset.familyId} · {preset.defaultUiPart}</p>
          <p className="mt-3 text-sm leading-6">{describe(preset)}</p>
        </article>
      ))}
    </section>
  )
}

type RecordListProps = {
  records: Workout[]
  dark: boolean
  onBegin: () => void
  onDownload: () => void
  onEdit: (workout: Workout) => void
  onRemove: (workout: Workout) => void
  formatDate: (date: string) => string
}

export function RecordListScreen({ records, dark, onBegin, onDownload, onEdit, onRemove, formatDate }: RecordListProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black italic">JOURNAL</h1>
          <p className="text-sm text-gray-500">운동 기록을 수정하거나 삭제할 수 있습니다.</p>
        </div>
        <button onClick={onBegin} className="rounded-2xl bg-[#ADFF2F] px-4 py-3 text-xs font-black text-black">NEW SESSION</button>
      </div>
      <button onClick={onDownload} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ADFF2F]/40 py-3 text-sm font-bold text-[#ADFF2F]"><Download size={16} />JSON 내보내기</button>
      {records.length ? records.map((workout) => (
        <article key={workout.id} className={`rounded-3xl border p-5 ${dark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-gray-50'}`}>
          <div className="flex justify-between gap-3">
            <div>
              <b>{workout.title || '운동 기록'}</b>
              <p className="mt-1 text-xs text-gray-400">{formatDate(workout.startedAt)} · {workout.exercises.length}개 운동 · 예상 {estimateTrainingMinutes(workout)}분</p>
            </div>
            <div className="flex gap-1">
              <button aria-label="수정" onClick={() => onEdit(workout)} className="rounded-xl p-2 text-[#ADFF2F]"><Edit2 size={18} /></button>
              <button aria-label="삭제" onClick={() => onRemove(workout)} className="rounded-xl p-2 text-red-400"><Trash2 size={18} /></button>
            </div>
          </div>
        </article>
      )) : <p className="py-20 text-center font-bold text-gray-400">아직 기록이 없습니다.</p>}
    </section>
  )
}

type EditorProps = {
  workout: Workout
  workoutDate: string
  maxDate: string
  dark: boolean
  panel: string
  onClose: () => void
  onSave: () => void
  onDateChange: (date: string) => void
  onTitleChange: (title: string | null) => void
  onExerciseChange: (index: number, exercise: Exercise) => void
  onExerciseDelete: (index: number) => void
  onOpenPicker: () => void
}

export function WorkoutEditorScreen(props: EditorProps) {
  const { workout, workoutDate, maxDate, dark, panel, onClose, onSave, onDateChange, onTitleChange, onExerciseChange, onExerciseDelete, onOpenPicker } = props
  return (
    <section className="space-y-5">
      <div className={`sticky top-[57px] z-10 -mx-4 flex justify-between border-b px-4 py-3 backdrop-blur ${dark ? 'border-white/10 bg-[#121212]/95' : 'border-black/10 bg-white/95'}`}>
        <button onClick={onClose} className="text-sm text-gray-400">← 기록 목록</button>
        <button onClick={onSave} className="rounded-xl bg-[#ADFF2F] px-4 py-2 text-sm font-black text-black">SAVE</button>
      </div>
      <input type="date" value={workoutDate} max={maxDate} onChange={(event) => onDateChange(event.target.value)} className={`w-full rounded-2xl p-4 font-bold outline-none ${panel}`} />
      <input value={workout.title || ''} onChange={(event) => onTitleChange(event.target.value || null)} className={`w-full rounded-2xl p-4 font-bold outline-none ${panel}`} placeholder="SESSION TITLE" />
      {workout.exercises.map((exercise, index) => (
        <ExerciseCard key={exercise.sourceExerciseInstanceId} exercise={exercise} dark={dark} onChange={(next) => onExerciseChange(index, next)} onDelete={() => onExerciseDelete(index)} />
      ))}
      <button onClick={onOpenPicker} className="w-full rounded-3xl border-2 border-dashed border-gray-500/40 py-8 font-black text-gray-400">+ 운동 추가</button>
    </section>
  )
}

type AnalysisProps = {
  records: Workout[]
  analysis: string
  analyzing: boolean
  panel: string
  onAnalyze: (mode: 'latest' | 'cumulative') => void
}

export function AnalysisScreen({ records, analysis, analyzing, panel, onAnalyze }: AnalysisProps) {
  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-black italic">AI COACH</h1>
      <p className="text-sm text-gray-500">최근 세션 또는 전체 누적 기록을 선택해 분석할 수 있습니다.</p>
      {records.length > 0 && <div className={`rounded-2xl p-4 text-sm ${panel}`}>최근 기록의 일반적 예상 운동 시간: <b className="text-[#ADFF2F]">약 {estimateTrainingMinutes(records[0])}분</b></div>}
      <div className="grid grid-cols-2 gap-3">
        <button disabled={!records.length || analyzing} onClick={() => onAnalyze('latest')} className="rounded-3xl bg-[#ADFF2F] px-3 py-5 text-sm font-black text-black disabled:opacity-40">{analyzing ? 'ANALYZING…' : '최근 기록 분석'}</button>
        <button disabled={!records.length || analyzing} onClick={() => onAnalyze('cumulative')} className="rounded-3xl border border-[#ADFF2F]/50 px-3 py-5 text-sm font-black text-[#ADFF2F] disabled:opacity-40">누적 기록 분석</button>
      </div>
      {analysis && <pre className={`whitespace-pre-wrap rounded-3xl p-5 text-sm leading-6 ${panel}`}>{analysis}</pre>}
    </section>
  )
}

type SettingsProps = {
  profile: Profile
  theme: Theme
  panel: string
  onProfileChange: (profile: Profile) => void
  onThemeChange: (theme: Theme) => void
  onSave: () => void
  onSignOut: () => void
}

export function SettingsScreen({ profile, theme, panel, onProfileChange, onThemeChange, onSave, onSignOut }: SettingsProps) {
  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-black italic">SETTINGS</h1>
      <div className={`rounded-3xl p-5 ${panel}`}>
        <p className="mb-3 font-bold">신체 정보</p>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min="0" placeholder="키 (cm)" value={profile.heightCm} onChange={(event) => onProfileChange({ ...profile, heightCm: event.target.value })} className="rounded-xl bg-black/10 p-3 outline-none" />
          <input type="number" min="0" placeholder="몸무게 (kg)" value={profile.weightKg} onChange={(event) => onProfileChange({ ...profile, weightKg: event.target.value })} className="rounded-xl bg-black/10 p-3 outline-none" />
        </div>
        <p className="mt-3 text-xs text-gray-500">저장한 값은 AI 운동 분석에 자동 반영됩니다.</p>
      </div>
      <div className={`rounded-3xl p-5 ${panel}`}>
        <p className="mb-3 font-bold">테마</p>
        <div className="grid grid-cols-3 gap-2">
          {(['light', 'dark', 'system'] as Theme[]).map((option) => (
            <button key={option} onClick={() => onThemeChange(option)} className={`rounded-xl py-3 text-xs font-black ${theme === option ? 'bg-[#ADFF2F] text-black' : 'bg-black/10'}`}>
              {option === 'light' ? <Sun className="mx-auto" size={16} /> : option === 'dark' ? <Moon className="mx-auto" size={16} /> : 'AUTO'}
            </button>
          ))}
        </div>
      </div>
      <button onClick={onSave} className="w-full rounded-2xl bg-[#ADFF2F] py-4 font-black text-black">환경설정 저장</button>
      <button onClick={onSignOut} className="w-full rounded-2xl border border-gray-500/30 py-4 text-sm font-bold">로그아웃</button>
    </section>
  )
}
