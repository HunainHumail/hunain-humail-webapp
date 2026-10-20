# Firebase

Public pages read Firestore through `src/services` and fall back to `src/lib/seed` when Firebase env is missing or a build-time read fails.

## Project id

Set the same project id in both places:

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in `.env.local` (see `.env.example`)
- `.firebaserc` → `projects.default`

`.firebaserc` `projects.default` is `hunain-humail-webapp`. Firestore `(default)` is in `me-central1`. Emulator scripts pass `--project demo-hunain-humail` and do not need a real project. Live site: https://hunain-humail-webapp.web.app

## Env

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Web SDK config. All six required keys must be set for `isFirebaseConfigured()`. |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` | Connect the web SDK and seed script to local emulators. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account JSON for `npm run seed` against a real project. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, and robots. |
| `STATIC_EXPORT=true` | `output: 'export'` build into `out/` (also set by `npm run build:static`). |

## Commands

- `npm run emulators` — Firestore, Auth, Storage, Functions (`:5001`), and the emulator UI (`:4000`).
- `npm run build:functions` — bundle `generateBlueprint` and `linkBlueprintContact` into `functions/lib/`.
- `npm run seed` — optional; push seed collections when the emulator or `GOOGLE_APPLICATION_CREDENTIALS` is available. Production seeding is the admin **Import seed data** button.
- `npm run test:rules` — security rules via the emulators (`tests/rules`, excluded from `npm test`).
- `firebase deploy --only hosting,firestore --project hunain-humail-webapp --non-interactive` — rules, indexes, and Hosting. Do not deploy Storage.

## Blueprint generator (Blaze)

The home-page **Blueprint your idea** section calls the `generateBlueprint` callable (App Check + Gemini). Upgrade to Blaze, set a GCP budget alert, then:

1. `GEMINI_API_KEY="…" npm run setup:blueprint-secrets` (see [`docs/blueprint-setup.md`](blueprint-setup.md))
2. Enable App Check with reCAPTCHA Enterprise; set `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`
3. `firebase deploy --only functions,firestore,hosting`

Leads live in `blueprintLeads` (admin read/update status only). Rate-limit counters use `blueprintRateLimits` with a TTL on `expiresAt` (see `firestore.indexes.json`). Contact messages may include optional `blueprintLeadId`; the `linkBlueprintContact` trigger sets `contactMessageId` on the lead.

## Rules

Published content is publicly readable. Writes require Google Auth with `email == hunainhumail786@gmail.com` and `email_verified`. `messages` are create-only (validated shape); only the admin can read them, mark them read, or delete them. `cliSessions` is used by the CMS CLI login: admin create/delete, public get for 10 minutes, no list or update. See [`docs/cms-cli.md`](cms-cli.md). `storage.rules` keeps the same admin check for `images/**` (public read, admin writes under 5MB) but Storage is not a deploy target: the Spark plan has not enabled it. The CMS keeps an image URL field and shows upload only when Storage is enabled.

Public pages fall back to `src/lib/seed` when Firebase env is missing, a collection is empty, or a read fails. With no service account, the admin dashboard **Import seed data** button upserts that seed after the owner signs in. The write is limited to the admin email and is safe to run again.

## Hosting

Spark hosting serves static files only. Production is a static export:

- `npm run build:static` (or `STATIC_EXPORT=true npm run build`) writes `out/`.
- `firebase.json` hosting `public` is `out/`, with `cleanUrls`, a rewrite of unknown `/admin/**` paths to `/admin.html`, and unknown `/work/**` paths to `/work/view.html` (new CMS slugs after the last export). `predeploy` runs `npm run build:static`.
- Public pages bake Firestore or seed into static HTML, then hydrate and read published docs live (see `docs/live-content.md`). Admin pages are static shells; the Firebase JS SDK runs in the browser and security rules enforce the admin email.
- `npm run lhci` scores the exported site (performance, accessibility, best practices, SEO at 0.95). It is not part of the default build.
