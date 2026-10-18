# CI workflow

`ci/github-actions-ci.yml` is the GitHub Actions workflow. It is not under `.github/workflows` yet because the push token does not have the `workflow` scope.

## Activate

1. Copy `ci/github-actions-ci.yml` to `.github/workflows/ci.yml`.
2. Commit that copy with a token that has the `workflow` scope.

## What it runs

On push and pull request to `main`:

- `npm ci`
- lint, typecheck, unit tests, and `npm run build`
- `npx playwright install chromium --with-deps`
- `npm run e2e`
- uploads the `playwright-report` artifact when a step fails

Playwright builds and starts the site on port 4173 with Firebase web env cleared, so pages use seed content. It sets `NEXT_PUBLIC_CONTACT_MOCK` and `NEXT_PUBLIC_E2E_SIGNED_OUT` for that server only. Do not set those flags in production hosting.
