import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchExerciseGif } from '../server/workoutxService.js';

test('rejects malformed WorkoutX ids before making a request', async () => {
  await assert.rejects(fetchExerciseGif('../secret', '', 'test-key'), (error) => error.status === 400);
});

test('rejects non-WorkoutX GIF hosts to prevent SSRF', async () => {
  await assert.rejects(
    fetchExerciseGif('valid-id', 'https://example.com/private.gif', 'test-key'),
    (error) => error.status === 400 && /허용되지 않은/.test(error.message)
  );
});
