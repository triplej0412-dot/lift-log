import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareAnalysisData } from '../server/geminiService.js';

function workout(date, title, part, name, weightKg = 50) {
  return {
    startedAt: date,
    title,
    estimatedTrainingDurationMinutes: 45,
    exercises: [{
      nameSnapshot: name,
      defaultUiPart: part,
      sets: [
        { weightKg, reps: 10, completed: true },
        { weightKg, reps: 8, completed: true }
      ]
    }]
  };
}

test('latest analysis removes storage-only fields while keeping useful set totals', () => {
  const prepared = prepareAnalysisData({
    profile: { heightCm: 173, weightKg: 69 },
    latestWorkout: workout('2026-09-21', '등', 'back', '랫 풀다운')
  }, 'latest');
  assert.equal(prepared.latestWorkout.exercises[0].name, '랫 풀다운');
  assert.equal(prepared.latestWorkout.exercises[0].totalReps, 18);
  assert.equal(prepared.latestWorkout.exercises[0].volumeKg, 900);
});

test('cumulative analysis keeps all-time aggregates and caps only detailed recent sessions', () => {
  const history = Array.from({ length: 70 }, (_, index) => workout(
    `2026-08-${String((index % 28) + 1).padStart(2, '0')}`,
    '운동',
    index % 2 ? 'back' : 'chest',
    index % 2 ? '랫 풀다운' : '벤치 프레스'
  ));
  const prepared = prepareAnalysisData({ profile: {}, workoutHistory: history }, 'cumulative');
  assert.equal(prepared.cumulativeSummary.workoutCount, 70);
  assert.equal(prepared.cumulativeSummary.recentSessions.length, 60);
  assert.equal(prepared.cumulativeSummary.olderSessionCount, 10);
  assert.equal(prepared.cumulativeSummary.muscleGroupStats.reduce((sum, item) => sum + item.sets, 0), 140);
});
