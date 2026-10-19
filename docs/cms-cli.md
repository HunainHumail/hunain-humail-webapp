# CMS CLI

Terminal CMS for the Hunain Humail site. It signs in as the admin Google user and uses the same Firestore rules as `/admin`. There is no service account, no Blaze plan, and the CLI never reads browser cookies or `firebase-tools` credentials.

## Setup

```bash
npm ci
cp .env.example .env.local
```

Fill `NEXT_PUBLIC_FIREBASE_API_KEY` and `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (the other `NEXT_PUBLIC_FIREBASE_*` keys are required for the login page). Then:

```bash
npm run cms -- login
```

The CLI reads `.env.local` / `.env` from the repo root, plus any values already in the environment.

## Login flow

1. `cms login` creates a random 32-byte session id and a 6-character user code.
2. It prints `https://hunain-humail-webapp.web.app/cli-login?session=<id>&code=<code>` and the code.
3. Open that URL, confirm the code matches the terminal, then sign in with Google.
4. Only `hunainhumail786@gmail.com` with a verified email can write `cliSessions/<id>`.
5. The CLI polls that document (unauthenticated get) every 3 seconds for up to 10 minutes.
6. On success it stores `{ refreshToken, email }` in `~/.config/hh-cms/credentials.json` (directory `700`, file `600`), exchanges the refresh token for an ID token, checks the email claim, and deletes the session document.

`/cli-login` is a static, `noindex` page. `robots.txt` also disallows it.

```bash
npm run cms -- whoami
npm run cms -- logout
```

Later commands refresh the ID token automatically when it expires.

## Commands

Collections: `work`, `writing`, `testimonials`, `story`, `now`, `profile` (doc `main`), `settings` (doc `site`).

Writes are validated with the same zod schemas as the admin CMS. `updatedAt` is set on every write. `undefined` fields are stripped. Import accepts `published: true` as `status: "published"`.

```bash
npm run cms -- list work
npm run cms -- list writing --published --json
npm run cms -- list story --drafts

npm run cms -- get work work-trinnect

npm run cms -- upsert work ./work-item.json
npm run cms -- upsert writing -
# stdin or a file may be one document or an array; merge is by id or slug

npm run cms -- delete now now-1 --yes

npm run cms -- publish writing writing-1
npm run cms -- unpublish writing writing-1

npm run cms -- reorder work work-a,work-b,work-c
# sets order to 1..n

npm run cms -- import testimonials ./quotes.json
npm run cms -- import work ./work.json --dry-run
# array upsert, Firestore commit batches of at most 450 writes
# prints created / updated counts

npm run cms -- seed
npm run cms -- seed --dry-run
# same payload as Admin → Import seed data
```

`list` prints a compact table: id/slug, title/name, status, order.

## Security notes

- The CLI acts as the admin user. Existing Firestore rules still apply.
- `cliSessions` is create-only for the verified admin, gettable by anyone for 10 minutes, not listable, not updatable, and deletable only by the admin.
- The refresh token is briefly visible to anyone who knows the unguessable session id. The CLI deletes the document after login.
- Credentials live only in `~/.config/hh-cms/credentials.json`. That path is outside the repo. Local scratch files matching `.hh-cms*` are gitignored.
- Do not point the CLI at production from CI. Do not commit credentials, service accounts, or cookie exports.
