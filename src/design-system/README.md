# Design system

Tokens live in `tokens/` and are mirrored as CSS variables in `src/app/globals.css` under `[data-theme="dark"]` (default) and `[data-theme="light"]`. Tailwind utilities are wired via `@theme inline`.

## Color

| Token | Dark | Light | Utility |
| --- | --- | --- | --- |
| bg | `#0a0e14` | `#f8f6f1` | `bg-bg` |
| surface | `#111820` | `#ffffff` | `bg-surface` |
| elevated | `#161d27` | `#f1efe8` | `bg-elevated` |
| border | faint white | faint ink | `border-border` |
| text | `#f1f5f9` | `#0f172a` | `text-text` |
| muted | `#94a3b8` | `#64748b` | `text-muted` |
| accent | `#22d3ee` | `#22d3ee` | `bg-accent`, `text-accent` |
| accent-contrast | `#0a0e14` | `#0a0e14` | `text-accent-contrast` |
| grid | faint lines | faint lines | `.bg-grid` |
| focus-ring | cyan | darker cyan | `ring-focus-ring` |

## Typography

- **Fonts**: Space Grotesk (`font-display`, `font-sans`), JetBrains Mono (`font-mono`) via `next/font`.
- **Scale**: `text-xs` … `text-4xl`, plus `text-display-xl` (clamp, line-height 0.9, tight tracking).
- **Tracking**: `tracking-tight`, `tracking-wide` (mono labels).

## Spacing

Standard Tailwind spacing scale (`0`–`24`) — see `tokens/spacing.ts`.

## Radius

`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`.

## Motion

- Durations: `duration-fast` (150ms), `duration-base` (250ms), `duration-slow` (400ms).
- Easings: `ease-default`, `ease-in`, `ease-out`, `ease-in-out`.

## Z-index

`z-base`, `z-raised`, `z-dropdown`, `z-sticky`, `z-overlay`, `z-modal`, `z-toast`.

## Utilities

- **`bg-grid`**: faint grid background using `--color-grid`.

## Atoms (`src/components/atoms`)

| Atom | Purpose |
| --- | --- |
| Button | `primary` / `ghost` / `pill`; sizes `sm` / `md` / `lg` |
| Heading | levels 1–6; optional `display` size |
| Text | `body` / `muted` / `small` |
| MonoLabel | uppercase mono caption |
| Chip | pill tag |
| Link | internal (`next/link`) or external `<a>` |
| Icon | `arrow`, `sun`, `moon`, `github`, `linkedin`, `mail`, `x` |
| Input / Textarea | form fields with focus ring |
| Badge | status `default` / `success` / `warning` / `error` |
| VisuallyHidden | screen-reader-only text |
| Container | max-width page gutter |
| Divider | horizontal rule |

Use `cn()` from `@/lib/utils/cn` to merge class names.
