# LiftLog

LiftLog is a workout journal with a React/Vite web client, a native Android app, Firebase Authentication and Firestore storage, and an authenticated Express API for Gemini analysis and WorkoutX exercise media.

## Architecture

- `src/analysisApi.ts` owns the web analysis API URL, Firebase ID token, request, and response parsing.
- `src/workoutRepository.ts` owns web Firestore workout CRUD and user preference access.
- `src/domain/` contains workout/profile types and workout calculations independent of React.
- `src/components/` and `src/screens.tsx` keep reusable UI and screen rendering out of the root app.
- `server/app.js` assembles Express middleware and routes.
- `server/firebaseAuth.js`, `server/geminiService.js`, and `server/workoutxService.js` isolate authentication and external integrations.
- `firestore.rules` enforces owner-only access to `users/{uid}`, `users/{uid}/workouts/{workoutId}`, and `users/{uid}/analyses/{analysisId}`.

Successful AI analyses are stored as lightweight snapshots under `users/{uid}/analyses/{analysisId}`. Each snapshot keeps the rendered result and the covered workout date range/count, not a full duplicate of all workout data. Failed requests are never saved.

## Local web development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill only the public Firebase web configuration.
3. Put server secrets in the ignored `server/.env` file. Never use a `VITE_` prefix for server secrets.
4. Run the backend with `npm start`.
5. Run the Vite client with `npm run dev`. Development `/api` requests are proxied to `http://localhost:5000`.

The production client uses `VITE_API_BASE_URL` when provided and otherwise defaults to the existing HTTPS Render API. It never falls back to localhost in production.

## Validation

```powershell
npm run lint
npm run build
npm run test:server
npm run test:rules
```

The Firestore emulator requires Java 17. Android Studio's bundled JDK can be selected for the current PowerShell session when Java is not already on `PATH`:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
npm run test:rules
```

Android can be checked from the `android` directory with `gradlew.bat assembleDebug testDebugUnitTest`.

## Firestore Rules deployment

Rules tests use the local emulator and do not modify production. After reviewing a branch and confirming production smoke tests, deploy explicitly:

```powershell
firebase deploy --only firestore:rules --project <firebase-project-id>
```

After deployment, verify Google login, workout read/create/update/delete, recent and cumulative AI analysis, and exercise GIF loading before merging the branch.
