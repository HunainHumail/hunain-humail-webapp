# Seed import audit

## Missing before

- LinkedIn posts in `src/content/linkedin-posts.ts` were not written to `writing` (admin only showed the two talks/awards).
- Import issued unbounded parallel `setDoc` calls, did not strip `undefined` (Firestore rejects it), and did not stamp `updatedAt`.
- Success copy was a generic “Seed data imported.” with no per-collection counts; Firestore errors were easy to miss.
- Writing admin had no image fields, so imported posts could not be inspected.
- Optional work `gallery` / `links` missing from a doc made schema parse strict enough that editors looked empty after a partial import.

## Fixed

- One payload from the same modules the site uses: `src/lib/seed/*` + `src/content/linkedin-posts.ts`.
- Counts: profile 1 (`main`), settings 1 (`site`), story 4, now 4, work 30 (incl. White Label VPN SDK gallery), writing 5 (2 talks/awards + 3 LinkedIn posts).
- Idempotent `set` with merge, chunked batches (≤450), `undefined` stripped, `updatedAt` set on every doc.
- Admin toast/status lists per-collection counts; failures name the collection and Firestore message.
- Admin editors use the same collection/doc ids and schemas (with defaults for `gallery`, `links`, `avatars`, `order`).
- `firestore.rules` already allow admin writes and public read of published docs on these collections, including extra fields such as `gallery` and post `image`. No rules change.
