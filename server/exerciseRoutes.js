import { Router } from 'express';
import { config } from './config.js';
import { requireFirebaseUser } from './firebaseAuth.js';
import { fetchExerciseGif, findExerciseMedia } from './workoutxService.js';

export const exerciseRouter = Router();

exerciseRouter.get('/exercise-media', requireFirebaseUser, async (req, res) => {
  const name = String(req.query.name || '').trim();
  const equipment = String(req.query.equipment || '').trim();
  const presetId = String(req.query.presetId || '').trim();
  if (!config.workoutxApiKey) return res.status(503).json({ error: 'WorkoutX API 키가 서버에 설정되지 않았습니다.' });
  if (!name) return res.status(400).json({ error: '운동 이름이 필요합니다.' });
  try {
    const media = await findExerciseMedia({ name, equipment, presetId, apiKey: config.workoutxApiKey });
    if (!media) return res.status(404).json({ error: 'WorkoutX에서 GIF가 있는 일치 운동을 찾지 못했습니다.' });
    res.json(media);
  } catch (error) {
    console.error('WorkoutX lookup failed:', error.message);
    res.status(502).json({ error: 'WorkoutX 연결에 실패했습니다.' });
  }
});

exerciseRouter.get('/exercise-gif/:id', requireFirebaseUser, async (req, res) => {
  if (!config.workoutxApiKey) return res.status(503).send('WorkoutX API 키가 서버에 설정되지 않았습니다.');
  try {
    const gif = await fetchExerciseGif(String(req.params.id || ''), String(req.query.source || ''), config.workoutxApiKey);
    res.set('Content-Type', gif.contentType);
    res.set('Cache-Control', 'private, max-age=604800');
    res.send(gif.body);
  } catch (error) {
    console.error('WorkoutX GIF fetch failed:', error.message);
    res.status(error.status || 502).send(error.status === 400 ? error.message : 'WorkoutX GIF 연결에 실패했습니다.');
  }
});
