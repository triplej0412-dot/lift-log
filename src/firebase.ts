import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// .env.local에 저장한 값들을 불러옵니다.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase 앱 실행(초기화)
const app = initializeApp(firebaseConfig);

// 우리가 앱에서 쓸 서비스들 내보내기
export const db = getFirestore(app); // 데이터베이스
export const auth = getAuth(app);    // 로그인 관리
export const googleProvider = new GoogleAuthProvider(); // 구글 로그인 도구