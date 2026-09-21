import dotenv from 'dotenv';

dotenv.config({ path: new URL('.env', import.meta.url) });

export const config = Object.freeze({
  port: Number(process.env.PORT) || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  // The previous gemini-3.6-flash default is currently returning 503 for this
  // API key. Keep the model configurable, but use the fast verified model.
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  workoutxApiKey: process.env.WORKOUTX_API_KEY || '',
  firebaseServiceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || ''
});
