# Blueprint — production setup

## 1. Gemini key → Firebase (server only)

```bash
npx firebase login
GEMINI_API_KEY="paste-from-ai-studio" npm run setup:blueprint-secrets
```

Never put `GEMINI_API_KEY` in `.env.local` or git.

## 2. `.env.local` (browser / build)

Copy Firebase **web app** config from Console → Project settings → Your apps.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_SITE_URL=https://hunain-humail-webapp.web.app
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=
NEXT_PUBLIC_FUNCTIONS_REGION=me-central1
```

Remove `NEXT_PUBLIC_BLUEPRINT_MOCK=true` when going live.

App Check: Firebase Console → App Check → Web → reCAPTCHA Enterprise → copy **site key**.

## 3. Deploy

```bash
cp functions/.env.example functions/.env   # first time only
npm run deploy:blueprint
```

## 4. Enforce App Check

Console → App Check → Cloud Functions → enforce for `generateBlueprint`.

## 5. Test

Live site → `/#blueprint` → Generate. Admin → `/admin/blueprints`.

Use `npx firebase` (not global `firebase`) if the global CLI crashes on Node 22+.

## Local dev (`localhost:3000`)

1. reCAPTCHA Enterprise key **domains** must include `localhost` and `127.0.0.1`.
2. After focusing the blueprint form, open the browser **Console** — copy the **App Check debug token** log line.
3. Firebase → App Check → your Web app → **Manage debug tokens** → Add → paste → Save.
4. Redeploy functions after CORS changes: `npm run deploy:blueprint`.
