# AGENTS.md — hunain-humail-webapp

Personal profile site + built-in CMS for **Hunain Humail** (software engineer, GenAI engineer, fintech & open finance).
Built AI-natively: humans write prompts, rules, agents and skills; Cursor agents write the code.

## Stack
Next.js (App Router) · TypeScript strict · Tailwind · in-project DLS (`src/design-system`) · GSAP + ScrollTrigger + Lenis · Framer Motion ·
Firebase (Firestore, Auth Google, Storage) · shadcn/ui (admin only) · Vitest + Testing Library · Playwright · GitHub Actions.

## Layout
```
src/
  app/                 routes only (thin: fetch data, compose templates)
  design-system/       tokens (color/type/spacing/motion) + README docs
  components/
    atoms/ molecules/ organisms/ templates/   (atomic design, pure UI)
    admin/             shadcn-based admin UI
  hooks/               React hooks (UI state, animation, data hooks)
  services/            content services (read/write CMS collections)
  lib/                 pure utilities, schemas (zod), types
  lib/firebase/        firebase client/admin init, repositories
tests/ (unit colocated as *.test.ts(x)) · e2e/ (Playwright)
docs/prototype.html   visual reference — follow its structure and feel
```

## Commands
`npm run dev` · `npm run lint` · `npm run typecheck` · `npm test` · `npm run e2e` · `npm run build`

## Golden rules
1. Read `.cursor/rules/*.mdc` before coding. They are mandatory.
2. Every feature ships with unit tests; `lint`, `typecheck`, `test`, `build` must pass before you finish.
3. All public content comes from Firestore via `src/services` (seed data in `src/lib/seed`). No hard-coded copy in components.
4. Content rules: never mention Hysab, co-founder or CTO; never mention studying/learning/courses/certifications; no "CTO-level" claims. Present Hunain as a GenAI engineer.
5. Keep the final reply short: what changed, files touched (count), test results. No code dumps.

## Agents & skills
Agents: `.cursor/agents/` (frontend-developer, design-system-keeper, unit-test-writer, qa-engineer).
Skills: `.cursor/skills/` (build-feature, create-component, write-tests, qa-verify).
