import { after, before, test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

let testEnvironment

before(async () => {
  testEnvironment = await initializeTestEnvironment({
    projectId: 'liftlog-rules-test',
    firestore: {
      rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8'),
    },
  })
})

after(async () => {
  await testEnvironment.cleanup()
})

function workoutDocument(context, uid, workoutId) {
  return doc(context.firestore(), 'users', uid, 'workouts', workoutId)
}

async function seedWorkout(uid, workoutId) {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(workoutDocument(context, uid, workoutId), { title: 'seed', status: 'completed' })
  })
}

test('unauthenticated read is denied', async () => {
  await seedWorkout('user-a', 'read-denied')
  await assertFails(getDoc(workoutDocument(testEnvironment.unauthenticatedContext(), 'user-a', 'read-denied')))
})

test('unauthenticated write is denied', async () => {
  await assertFails(setDoc(workoutDocument(testEnvironment.unauthenticatedContext(), 'user-a', 'write-denied'), { title: 'blocked' }))
})

test('user can read own workout', async () => {
  await seedWorkout('user-a', 'own-read')
  await assertSucceeds(getDoc(workoutDocument(testEnvironment.authenticatedContext('user-a'), 'user-a', 'own-read')))
})

test('user can create own workout', async () => {
  await assertSucceeds(setDoc(workoutDocument(testEnvironment.authenticatedContext('user-a'), 'user-a', 'own-create'), { title: 'created' }))
})

test('user can update own workout', async () => {
  await seedWorkout('user-a', 'own-update')
  await assertSucceeds(updateDoc(workoutDocument(testEnvironment.authenticatedContext('user-a'), 'user-a', 'own-update'), { title: 'updated' }))
})

test('user can delete own workout', async () => {
  await seedWorkout('user-a', 'own-delete')
  await assertSucceeds(deleteDoc(workoutDocument(testEnvironment.authenticatedContext('user-a'), 'user-a', 'own-delete')))
})

test('user cannot read another user workout', async () => {
  await seedWorkout('user-b', 'other-read')
  await assertFails(getDoc(workoutDocument(testEnvironment.authenticatedContext('user-a'), 'user-b', 'other-read')))
})

test('user cannot write another user workout', async () => {
  await assertFails(setDoc(workoutDocument(testEnvironment.authenticatedContext('user-a'), 'user-b', 'other-write'), { title: 'blocked' }))
})

test('owner can complete the workout CRUD lifecycle', async () => {
  const workoutRef = workoutDocument(testEnvironment.authenticatedContext('user-a'), 'user-a', 'crud-smoke')
  await assertSucceeds(setDoc(workoutRef, { title: '등', status: 'completed' }))
  const created = await assertSucceeds(getDoc(workoutRef))
  if (created.data()?.title !== '등') throw new Error('created workout was not readable')
  await assertSucceeds(updateDoc(workoutRef, { title: '등 · 이두' }))
  const updated = await assertSucceeds(getDoc(workoutRef))
  if (updated.data()?.title !== '등 · 이두') throw new Error('workout update was not persisted')
  await assertSucceeds(deleteDoc(workoutRef))
  const deleted = await assertSucceeds(getDoc(workoutRef))
  if (deleted.exists()) throw new Error('workout delete did not persist')
})

test('analysis records are isolated by the same user ownership rule', async () => {
  const aliceDb = testEnvironment.authenticatedContext('user-a').firestore()
  const aliceAnalysis = doc(aliceDb, 'users', 'user-a', 'analyses', 'analysis-1')
  await assertSucceeds(setDoc(aliceAnalysis, { mode: 'recent', result: 'saved analysis' }))
  await assertFails(getDoc(doc(aliceDb, 'users', 'user-b', 'analyses', 'analysis-1')))
})
