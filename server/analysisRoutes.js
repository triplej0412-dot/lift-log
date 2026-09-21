import { Router } from 'express';
import { validateAnalysisRequest } from './analysisValidation.js';
import { config } from './config.js';
import { requireFirebaseUser } from './firebaseAuth.js';
import { analyzeWithGemini, GeminiAnalysisError } from './geminiService.js';

export const analysisRouter = Router();

analysisRouter.post('/analyze', requireFirebaseUser, async (req, res) => {
  try {
    const validationError = validateAnalysisRequest(req.body);
    if (validationError) return res.status(400).json({ error: validationError });
    if (!config.geminiApiKey) return res.status(503).json({ error: 'Gemini API 키가 서버에 설정되지 않았습니다.' });
    const { workoutData, analysisMode = 'latest' } = req.body;
    res.json(await analyzeWithGemini(workoutData, analysisMode, config.geminiApiKey, config.geminiModel));
  } catch (error) {
    console.error('❌ 서버 내부 에러:', error.message);
    const status = error instanceof GeminiAnalysisError ? error.status : 500;
    const message = error instanceof GeminiAnalysisError ? error.message : 'AI 분석 중 오류가 발생했습니다.';
    res.status(status).json({ error: message });
  }
});
