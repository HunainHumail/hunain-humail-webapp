---
name: qa-verify
description: Full QA pass — static checks, unit, build, e2e, content-rule audit, report.
---
1. `npm ci` if node_modules missing; `npx playwright install chromium` if needed.
2. Run lint → typecheck → unit → build → e2e; capture only failures.
3. Content audit: `rg -i "hysab|co-?founder|\bcto\b|studying|certif|course" src` must return nothing.
4. A11y smoke: each page has one h1, landmarks, labelled inputs.
5. Fix trivial issues, re-run, then output a compact report table and remaining risks.
