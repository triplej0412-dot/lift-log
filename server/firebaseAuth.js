import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from './config.js';

if (config.firebaseServiceAccountJson && !getApps().length) {
  initializeApp({ credential: cert(JSON.parse(config.firebaseServiceAccountJson)) });
} else if (!config.firebaseServiceAccountJson) {
  console.warn('Firebase Admin is not configured; authenticated analysis is unavailable.');
}

export function createFirebaseUserGuard({
  isConfigured = () => getApps().length > 0,
  verifyIdToken = (token) => getAuth().verifyIdToken(token)
} = {}) {
  return async function firebaseUserGuard(req, res, next) {
    if (!isConfigured()) return res.status(503).json({ error: 'AI server authentication is not configured.' });
    const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return res.status(401).json({ error: '로그인이 필요합니다.' });
    try {
      req.firebaseUser = await verifyIdToken(token);
      next();
    } catch {
      res.status(401).json({ error: '로그인 인증이 만료되었거나 유효하지 않습니다.' });
    }
  };
}

export const requireFirebaseUser = createFirebaseUserGuard();
