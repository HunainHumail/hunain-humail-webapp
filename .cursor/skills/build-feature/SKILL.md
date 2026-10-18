---
name: build-feature
description: Step-by-step recipe to build one feature end to end (data → logic → UI → tests).
---
1. Read AGENTS.md, rules, and the relevant part of `docs/prototype.html`.
2. Define/extend zod schema + types in `src/lib/schemas` and seed data in `src/lib/seed` (respect content rules).
3. Add service function in `src/services` (reads via repository; falls back to seed when Firebase env is absent).
4. Build UI bottom-up with `create-component`; wire it in the template/page.
5. Write tests with `write-tests` (component + logic).
6. Run lint, typecheck, test, build. Fix until green.
7. Reply with ≤8 lines: summary, file count, test counts. Do not commit (orchestrator commits).
