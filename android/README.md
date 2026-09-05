# LiftLog Android

Open this `android/` folder in Android Studio. Before running, register `com.liftlog.app` as an Android app in the same Firebase project, put its downloaded `google-services.json` in `app/`, and replace `google_web_client_id` in `app/src/main/res/values/strings.xml` with the Firebase Web client ID.

The app uses the same `users/{uid}/workouts` Firestore collection and ships the exact 363-preset friend catalog. Its set model preserves raw kg canonical values and the V2 `inputLoadValue` / `inputLoadUnit` fields. The analysis server URL defaults to the Android emulator host `http://10.0.2.2:5000`; set a LAN HTTPS URL for a physical device by changing `ANALYSIS_BASE_URL` in `app/build.gradle.kts`.

This first native project includes the Compose navigation, catalog/search, date-based workout editor, set deletion, kg/lb selector and delete confirmation UI. Before release, connect Google Sign-In and the existing `/api/analyze` request client, then add the Android file picker/export share sheet around the identical web V2 payload. Those secrets and Firebase client configuration are intentionally not copied into source control.
