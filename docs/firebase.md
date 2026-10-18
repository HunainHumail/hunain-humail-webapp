# Firebase

Public pages read Firestore through `src/services` and fall back to `src/lib/seed` when Firebase env is missing or a build-time read fails.

## Project id

Set the same project id in both places:

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in `.env.local` (see `.env.example`)
- `.firebaserc` → `projects.default`

The committed `.firebaserc` value `your-firebase-project-id` is a placeholder. Replace it before `firebase deploy`. Emulator scripts pass `--project demo-hunain-humail` and do not need a real project.

## Env

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Web SDK config. All six required keys must be set for `isFirebaseConfigured()`. |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` | Connect the web SDK and seed script to local emulators. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account JSON for `npm run seed` against a real project. |

## Commands

- `npm run emulators` — Firestore, Auth, Storage, and the emulator UI (`:4000`).
- `npm run seed` — push seed collections (`profile/main`, `settings/site`, `story`, `now`, `work`, `writing`).
- `npm run test:rules` — security rules via the emulators (`tests/rules`, excluded from `npm test`).

## Rules

Published content is publicly readable. Writes require Google Auth with `email == hunainhumail786@gmail.com` and `email_verified`. `messages` are create-only (validated shape); only the admin can read or delete them. Storage `images/**` is public-read; admin writes are limited to images under 5MB.
