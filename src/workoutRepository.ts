import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData
} from 'firebase/firestore'
import { db } from './firebase'

export type WorkoutDocument = DocumentData & {
  id: string
  startedAt: string
  endedAt: string | null
}

export type WorkoutWrite = DocumentData & {
  startedAt: string
  endedAt: string | null
}

export type AnalysisDocument = {
  id: string
  mode: 'latest' | 'cumulative'
  result: string
  createdAtMillis: number
  triggerWorkoutId: string | null
  rangeFrom: string
  rangeTo: string
  workoutCount: number
}

const workoutsPath = (uid: string) => collection(db, `users/${uid}/workouts`)
const workoutPath = (uid: string, workoutId: string) => doc(db, `users/${uid}/workouts`, workoutId)

function timestampToIso(value: unknown) {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate().toISOString()
  }
  return typeof value === 'string' ? value : new Date().toISOString()
}

function toFirestoreWorkout(workout: WorkoutWrite) {
  return {
    ...workout,
    startedAt: Timestamp.fromDate(new Date(workout.startedAt)),
    endedAt: workout.endedAt ? Timestamp.fromDate(new Date(workout.endedAt)) : null
  }
}

export async function listWorkouts(uid: string): Promise<WorkoutDocument[]> {
  const snapshot = await getDocs(query(workoutsPath(uid), orderBy('startedAt', 'desc')))
  return snapshot.docs.map((workoutDoc) => {
    const data = workoutDoc.data()
    return {
      ...data,
      id: workoutDoc.id,
      startedAt: timestampToIso(data.startedAt),
      endedAt: data.endedAt ? timestampToIso(data.endedAt) : null
    } as WorkoutDocument
  })
}

export async function saveWorkout(uid: string, workoutId: string | undefined, workout: WorkoutWrite) {
  const data = toFirestoreWorkout(workout)
  if (workoutId) {
    await updateDoc(workoutPath(uid, workoutId), data)
    return workoutId
  }
  const created = await addDoc(workoutsPath(uid), data)
  return created.id
}

export async function deleteWorkout(uid: string, workoutId: string) {
  await deleteDoc(workoutPath(uid, workoutId))
}

export async function getUserPreferences(uid: string) {
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? snapshot.data() : null
}

export async function saveUserPreferences(uid: string, preferences: DocumentData) {
  await setDoc(doc(db, 'users', uid), preferences, { merge: true })
}

export async function listAnalyses(uid: string): Promise<AnalysisDocument[]> {
  const snapshot = await getDocs(query(collection(db, `users/${uid}/analyses`), orderBy('createdAtMillis', 'desc')))
  return snapshot.docs.map((analysisDoc) => {
    const data = analysisDoc.data()
    return {
      id: analysisDoc.id,
      mode: data.mode === 'cumulative' ? 'cumulative' : 'latest',
      result: String(data.result || ''),
      createdAtMillis: Number(data.createdAtMillis || 0),
      triggerWorkoutId: data.triggerWorkoutId ? String(data.triggerWorkoutId) : null,
      rangeFrom: String(data.rangeFrom || ''),
      rangeTo: String(data.rangeTo || ''),
      workoutCount: Number(data.workoutCount || 0)
    }
  })
}

export async function saveAnalysis(uid: string, analysis: Omit<AnalysisDocument, 'id'>) {
  await addDoc(collection(db, `users/${uid}/analyses`), {
    ...analysis,
    schemaVersion: 1,
    createdAt: Timestamp.now()
  })
}
