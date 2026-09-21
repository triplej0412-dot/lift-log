import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAnalysisRequest } from '../server/analysisValidation.js';

const validWorkout = {
  title: '등',
  exercises: [{
    nameSnapshot: '랫 풀다운',
    sets: [{ weightKg: 50, inputLoadValue: '50', inputLoadUnit: 'kg', reps: 10 }]
  }]
};

test('accepts a valid latest-analysis payload', () => {
  assert.equal(validateAnalysisRequest({
    analysisMode: 'latest',
    workoutData: { latestWorkout: validWorkout, profile: { heightCm: '173', weightKg: 69 } }
  }), null);
});

test('accepts a valid cumulative-analysis payload', () => {
  assert.equal(validateAnalysisRequest({
    analysisMode: 'cumulative',
    workoutData: { workoutHistory: [validWorkout] }
  }), null);
});

test('rejects an unsupported analysis mode', () => {
  assert.match(validateAnalysisRequest({ analysisMode: 'all', workoutData: {} }), /analysisMode/);
});

test('rejects missing latest workout', () => {
  assert.match(validateAnalysisRequest({ analysisMode: 'latest', workoutData: {} }), /운동 기록/);
});

test('rejects an empty cumulative history', () => {
  assert.match(validateAnalysisRequest({ analysisMode: 'cumulative', workoutData: { workoutHistory: [] } }), /workoutHistory/);
});

test('rejects invalid load units and negative values', () => {
  const badUnit = structuredClone(validWorkout);
  badUnit.exercises[0].sets[0].inputLoadUnit = 'stone';
  assert.match(validateAnalysisRequest({ analysisMode: 'latest', workoutData: { latestWorkout: badUnit } }), /kg 또는 lb/);

  const negative = structuredClone(validWorkout);
  negative.exercises[0].sets[0].weightKg = -1;
  assert.match(validateAnalysisRequest({ analysisMode: 'latest', workoutData: { latestWorkout: negative } }), /중량/);
});

test('rejects unreasonable profile values and oversized text', () => {
  assert.match(validateAnalysisRequest({
    analysisMode: 'latest',
    workoutData: { latestWorkout: validWorkout, profile: { heightCm: 400 } }
  }), /키/);
  assert.match(validateAnalysisRequest({
    analysisMode: 'latest',
    workoutData: { latestWorkout: { ...validWorkout, memo: 'x'.repeat(2_001) } }
  }), /텍스트/);
});
