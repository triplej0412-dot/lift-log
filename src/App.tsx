import { useEffect, useMemo, useState } from 'react'
import './recordCardNavigation'
import { auth, googleProvider } from './firebase'
import { onAuthStateChanged, signInWithPopup, type User } from 'firebase/auth'
import { BarChart2, ClipboardList, Info, LogIn, Plus, Settings, X } from 'lucide-react'
import catalog from './friend_exercise_catalog_v1.json'
import { analyzeWorkout } from './analysisApi'
import { deleteWorkout, getUserPreferences, listAnalyses, listWorkouts, saveAnalysis, saveUserPreferences, saveWorkout } from './workoutRepository'
import { SearchBox } from './components/SearchBox'
import { AnalysisScreen, InfoScreen, RecordListScreen, SettingsScreen, WorkoutEditorScreen } from './screens'
import type { Profile, Theme } from './domain/profile'
import {
  calculateVolumeKg as volume,
  createBlankWorkout as blank,
  createId as id,
  createSet as makeSet,
  estimateTrainingMinutes as estimatedMinutes,
  nowIso as now,
  toTransferWorkout as exportWorkout,
  type Exercise,
  type Preset,
  type Workout
} from './domain/workout'

const presets=(catalog as {presets:Preset[]}).presets
const localDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date())
const setDate=(date:string)=>new Date(`${date}T12:00:00+09:00`).toISOString()
const dateFrom=(date:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date(date))
function guide(p:Preset){const part:{[key:string]:string}={chest:'가슴',back:'등',legs:'하체',shoulders:'어깨',arms:'팔',abs:'복부'}; const record:{[key:string]:string}={weight_reps:'중량과 반복 횟수',reps_only:'반복 횟수',time:'유지 시간(초)',weight_time:'중량과 시간(초)',assisted_weight_reps:'보조 중량과 반복 횟수',bodyweight_added_weight_reps:'맨몸 또는 추가 중량과 반복 횟수'}; return `${p.nameKo}는 ${part[p.defaultUiPart]||p.defaultUiPart}를 중심으로 하는 ${p.familyId.replaceAll('_',' ')} 계열 운동입니다. 기록할 때는 ${record[p.recordType]}를 입력합니다.${p.laterality==='unilateral'?' 반복과 중량은 한쪽 기준입니다.':''}${p.implementMultiplier===2?' 덤벨 등 독립 implements는 한 개 기준 중량을 입력합니다.':''}`}
function filterPresets(items:Preset[], query:string){const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return items.filter(p=>{const target=`${p.nameKo} ${p.nameEn} ${p.familyId}`.toLowerCase();return terms.every(term=>target.includes(term))}).sort((a,b)=>a.nameKo.localeCompare(b.nameKo,'ko'))}

export default function App(){
 const [user,setUser]=useState<User|null>(null),[theme,setTheme]=useState<Theme>('dark'),[tab,setTab]=useState<'info'|'record'|'analysis'|'settings'>('record'),[editing,setEditing]=useState(false),[records,setRecords]=useState<Workout[]>([]),[workout,setWorkout]=useState<Workout>(blank),[workoutDate,setWorkoutDate]=useState(localDate()),[picker,setPicker]=useState(false),[search,setSearch]=useState(''),[infoSearch,setInfoSearch]=useState(''),[infoPart,setInfoPart]=useState<string|null>(null),[profile,setProfile]=useState<Profile>({heightCm:'',weightKg:''}),[analysis,setAnalysis]=useState(''),[analyzing,setAnalyzing]=useState(false)
 const dark=theme==='dark'||(theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)
 const reload=async(uid:string)=>setRecords(await listWorkouts(uid) as Workout[])
 useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);if(u)void (async()=>{const x=await getUserPreferences(u.uid);if(x){setProfile({heightCm:x.heightCm?String(x.heightCm):'',weightKg:x.weightKg?String(x.weightKg):''});if(x.theme)setTheme(x.theme)}const [workouts,analyses]=await Promise.all([listWorkouts(u.uid),listAnalyses(u.uid)]);setRecords(workouts as Workout[]);const latest=analyses[0];if(latest)setAnalysis(`${latest.mode==='latest'?'최근 기록 분석':'누적 기록 분석'}\n\n${latest.result}`)})()}),[])
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light'},[dark])
 const matches=useMemo(()=>filterPresets(presets,search),[search]);const infoMatches=useMemo(()=>filterPresets(presets,infoSearch).filter(p=>!infoPart||p.defaultUiPart===infoPart),[infoSearch,infoPart])
 const begin=()=>{setWorkout(blank());setWorkoutDate(localDate());setEditing(true)}
 const edit=(w:Workout)=>{setWorkout(w);setWorkoutDate(dateFrom(w.startedAt));setEditing(true)}
 const add=(p:Preset)=>{setWorkout(w=>({...w,exercises:[...w.exercises,{...p,sourceExerciseInstanceId:id(),orderIndex:w.exercises.length+1,nameSnapshot:p.nameKo,memo:null,sets:[makeSet(p,1)]}]}));setPicker(false);setSearch('')}
 const changeExercise=(index:number,next:Exercise)=>setWorkout(w=>({...w,exercises:w.exercises.map((e,i)=>i===index?next:e)}))
 const save=async()=>{if(!user||!workout.exercises.length)return alert('운동을 하나 이상 추가해 주세요.');const done={...workout,status:'completed' as const,startedAt:setDate(workoutDate),endedAt:workout.id?workout.endedAt||now():now()};const data={...done,derivedVolumeKg:volume(done)};await saveWorkout(user.uid,done.id,data);setEditing(false);setWorkout(blank());await reload(user.uid)}
 const remove=async(w:Workout)=>{if(!user||!w.id||!confirm('이 운동기록을 삭제하시겠습니까?'))return;await deleteWorkout(user.uid,w.id);await reload(user.uid)}
 const download=()=>{if(!records.length)return alert('내보낼 완료 기록이 없습니다.');const payload={format:'yeonsik.workout-transfer',formatVersion:2,catalogContractVersion:1,catalogSourceCommit:'381e160771b8859ac68c51ec67c1e6ed6c08a26f',sourceApp:'liftlog',exportedAt:now(),workouts:records.map(exportWorkout)};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`liftlog-workouts-${localDate()}.json`;a.click();URL.revokeObjectURL(url)}
 const saveProfile=async()=>{if(!user)return;await saveUserPreferences(user.uid,{heightCm:profile.heightCm?Number(profile.heightCm):null,weightKg:profile.weightKg?Number(profile.weightKg):null,theme});alert('신체 정보와 환경설정을 저장했습니다.')}
 const analyze=async(mode:'latest'|'cumulative')=>{
  if(!user||!records.length)return;
  setAnalyzing(true);setAnalysis('');
  const history=records.map(workout=>({...exportWorkout(workout),estimatedTrainingDurationMinutes:estimatedMinutes(workout)}));
  const latestWorkout={...exportWorkout(records[0]),estimatedTrainingDurationMinutes:estimatedMinutes(records[0])};
  const profileData={heightCm:profile.heightCm?Number(profile.heightCm):null,weightKg:profile.weightKg?Number(profile.weightKg):null};
  const payload=mode==='latest'
   ? {analysisMode:mode,workoutData:{profile:profileData,latestWorkout}}
   : {analysisMode:mode,workoutData:{profile:profileData,cumulativeSummary:{workoutCount:history.length,from:history.at(-1)?.startedAt,to:history[0]?.startedAt},workoutHistory:history}};
  try{
   const result=await analyzeWorkout(payload);
   const title=mode==='latest'?'최근 기록 분석':'누적 기록 분석';
   const text=`총평\n${result.summary}\n\n잘한 점\n${result.good}\n\n개선점\n${result.bad}\n\n다음 운동 추천\n${result.nextFocus}`;
   setAnalysis(`${title}\n\n${text}`);
   const createdAtMillis=Date.now(); await saveAnalysis(user.uid,{mode,result:text,createdAtMillis,triggerWorkoutId:records[0]?.id||null,rangeFrom:dateFrom(records.at(-1)?.startedAt||now()),rangeTo:dateFrom(records[0]?.startedAt||now()),workoutCount:records.length});
  }catch(e){setAnalysis(`분석 실패: ${e instanceof Error?e.message:'서버 연결 실패'}`)}finally{setAnalyzing(false)}
 }; if(!user)return <main className="grid min-h-screen place-items-center bg-[#121212] p-6"><button onClick={()=>signInWithPopup(auth,googleProvider)} className="rounded-full bg-white px-10 py-4 font-black text-black"><LogIn className="mr-2 inline" size={18}/>GOOGLE LOGIN</button></main>
 const panel=dark?'bg-white/10':'bg-gray-100';return <div className={`min-h-screen pb-28 ${dark?'bg-[#121212] text-white':'bg-white text-[#121212]'}`}><header className={`sticky top-0 z-20 flex items-center justify-between border-b px-5 py-4 backdrop-blur ${dark?'border-white/10 bg-[#121212]/90':'border-black/10 bg-white/90'}`}><b className="text-xl italic text-[#ADFF2F]">LIFTLOG</b><span className="text-xs font-bold text-gray-400">{user.displayName}</span></header><main className="mx-auto max-w-md p-4">
 {tab==='info'&&<InfoScreen activePart={infoPart} onSelectPart={setInfoPart} search={infoSearch} onSearch={setInfoSearch} matches={infoMatches} panel={panel} dark={dark} describe={guide}/>}
 {tab==='record'&&!editing&&<RecordListScreen records={records} dark={dark} onBegin={begin} onDownload={download} onEdit={edit} onRemove={w=>void remove(w)} formatDate={dateFrom}/>}
 {tab==='record'&&editing&&<WorkoutEditorScreen workout={workout} workoutDate={workoutDate} maxDate={localDate()} dark={dark} panel={panel} onClose={()=>setEditing(false)} onSave={()=>void save()} onDateChange={setWorkoutDate} onTitleChange={title=>setWorkout(w=>({...w,title}))} onExerciseChange={changeExercise} onExerciseDelete={i=>setWorkout(w=>({...w,exercises:w.exercises.filter((_,n)=>n!==i).map((x,n)=>({...x,orderIndex:n+1}))}))} onOpenPicker={()=>setPicker(true)}/>}
 {tab==='analysis'&&<AnalysisScreen records={records} analysis={analysis} analyzing={analyzing} panel={panel} onAnalyze={mode=>void analyze(mode)}/>}
 {tab==='settings'&&<SettingsScreen profile={profile} theme={theme} panel={panel} onProfileChange={setProfile} onThemeChange={setTheme} onSave={()=>void saveProfile()} onSignOut={()=>void auth.signOut()}/>}
 </main>{tab==='record'&&editing&&<button type="button" onClick={()=>void save()} style={{position:'fixed',bottom:'5.5rem',right:'1.25rem',zIndex:100}} className="rounded-2xl bg-[#ADFF2F] px-6 py-4 text-sm font-black text-black shadow-xl shadow-[#ADFF2F]/30 active:scale-95">SAVE</button>}{picker&&<div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4"><div className={`mx-auto max-w-md rounded-3xl p-5 ${dark?'bg-[#1c1c1c]':'bg-white'}`}><div className="mb-4 flex justify-between"><b>운동 선택 ({presets.length})</b><button onClick={()=>setPicker(false)}><X/></button></div><SearchBox value={search} onChange={setSearch} dark={dark}/><div className="mt-4 max-h-[70vh] space-y-2 overflow-y-auto">{matches.map(p=><button key={p.presetId} onClick={()=>add(p)} className={`flex w-full justify-between rounded-2xl p-4 text-left ${dark?'bg-white/5':'bg-gray-50'}`}><span><b className="block">{p.nameKo}</b><small className="text-gray-500">{p.familyId} · {p.recordType}</small></span><Plus className="text-[#ADFF2F]"/></button>)}</div></div></div>}<nav className={`fixed bottom-0 left-0 right-0 flex justify-around border-t px-4 py-4 ${dark?'border-white/10 bg-[#121212]':'border-black/10 bg-white'}`}>{([{id:'info',label:'INFO',icon:<Info/>},{id:'record',label:'RECORD',icon:<ClipboardList/>},{id:'analysis',label:'STATS',icon:<BarChart2/>},{id:'settings',label:'CFG',icon:<Settings/>}]as const).map(item=><button key={item.id} onClick={()=>{setTab(item.id);if(item.id==='record')setEditing(false)}} className={`flex flex-col items-center gap-1 text-[9px] font-black ${tab===item.id?'text-[#ADFF2F]':'text-gray-400'}`}>{item.icon}{item.label}</button>)}</nav></div>
}
