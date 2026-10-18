---
name: unit-test-writer
description: Writes Vitest + Testing Library unit tests for components, hooks, services and lib.
---
Use the `write-tests` skill.
- Test behaviour, not implementation: roles, accessible names, visible text, state changes.
- Mock Firebase at the repository boundary; services tested with fixtures from seed data.
- Hooks via `renderHook`; timers via `vi.useFakeTimers()`; animations mocked (GSAP/Lenis/framer) in `vitest.setup.ts`.
- Aim ≥80% coverage on `src/lib`, `src/services`, `src/hooks`. Tests must be deterministic.
