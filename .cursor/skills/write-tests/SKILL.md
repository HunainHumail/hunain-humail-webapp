---
name: write-tests
description: Write Vitest unit tests and Playwright e2e specs that are fast and deterministic.
---
- Unit: colocated `*.test.ts(x)`; use `@testing-library/react` + `user-event`; query by role/label/text.
- Mock `src/lib/firebase/*` with `vi.mock`; use seed fixtures.
- Time-based UI (clock, typing): fake timers, fixed `Date`.
- e2e: `e2e/*.spec.ts`, use role locators, no fixed sleeps, run on desktop + mobile projects.
- Run `npm test -- --run` (and `npm run e2e` for e2e) and make them pass.
