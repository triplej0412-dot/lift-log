import express from 'express';
import cors from 'cors';
import { analysisRouter } from './analysisRoutes.js';
import { exerciseRouter } from './exerciseRoutes.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '256kb' }));
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', analysisRouter);
  app.use('/api', exerciseRouter);
  return app;
}
