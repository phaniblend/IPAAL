# Google Sign-In (Firebase) — test locally

## 1. Create a Firebase project (free)

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. **Add project** (or use an existing one). No Blaze plan needed.
3. In the project, go to **Build → Authentication** → **Get started** → **Sign-in method**.
4. Enable **Google** (toggle on, set support email), save.

## 2. Register your web app

1. Project overview → **</>** (Web).
2. Register app with a nickname (e.g. `inpact-web`).
3. Copy the `firebaseConfig` object you get.

## 3. Add env vars to `.env`

Create or edit `.env` in the project root and add (use your own values from the config):

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Restart the dev server after changing `.env` (`npm run dev`).

## 4. Test

1. Use 3 lessons (any track), then open a 4th → Register modal appears.
2. Click **Google** → popup opens → sign in with a Google account.
3. On success, modal closes and you continue to the lesson.

**Localhost:** Firebase allows `localhost` by default for Auth. For production, add your domain in **Authentication → Settings → Authorized domains**.
