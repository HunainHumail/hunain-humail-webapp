# Design system

Tokens live in `tokens/` and are mirrored as CSS variables in `src/app/globals.css` under `:root` (dark default so utilities resolve before `data-theme` is set), `[data-theme="dark"]`, and `[data-theme="light"]`. Color, spacing, and motion utilities are wired via `@theme inline`. Display type tokens live in a non-inline `@theme` block so `--text-display-*` is emitted on `:root` and `text-display-hero` / `text-display-section` / `text-display-counter` utilities resolve.

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
| grid | 5% white | 4% ink | `.bg-grid` |
| grid-hero | 8% cyan | 5.5% teal | `.bg-grid-hero` (radial mask) |
| glow | cyan halo | teal halo | `--color-glow` |
| focus-ring | cyan | darker cyan | `ring-focus-ring` |

Accent `#22d3ee` is reserved for the name-dot, active nav, scroll progress, primary pill CTAs, timeline dots/progress, hover borders, terminal prompt/caret, and focus rings.

## Typography

- **Fonts**: Space Grotesk (`font-display`, `font-sans`), JetBrains Mono (`font-mono`) via `next/font`.
- **Scale**: `text-xs` … `text-4xl`, plus:
  - `text-display-hero` / `text-display-xl` — `clamp(64px, 9vw, 128px)`, line-height `0.88`, tracking `-0.05em`
  - `text-display-section` — `clamp(2.75rem, 5vw, 3.75rem)` (44–60px), line-height `0.92`, tracking `-0.03em`
  - `text-display-counter` — outlined section index
  - `text-mono-md` — 15px terminal body
- **Tracking**: `tracking-tighter` (`-0.05em`), `tracking-tight` (`-0.03em`), `tracking-wide` (mono labels).

## Spacing

Standard Tailwind scale plus:

| Token | Value | Utility |
| --- | --- | --- |
| gutter | `1.25rem` | `px-gutter` |
| gutter-lg | `2.5rem` | `md:px-gutter-lg` |
| section | `5rem` | `py-section` |
| section-lg | `8.5rem` (136px) | `md:py-section-lg` |
| terminal | `27.5rem` (440px) | `min-w-terminal` |
| avatar | `6rem` (96px) | `size-avatar` |
| 32 / 40 | `8rem` / `10rem` | `py-32`, `py-40` |
| page | `80rem` (1280px) | `max-w-page` |

## Aspect

| Token | Value | Utility |
| --- | --- | --- |
| cover | `4 / 3` | `aspect-cover` |

Used for work covers on cards and case-study pages.

## Radius

`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`.

## Motion

- Durations: `duration-fast` (150ms), `duration-base` (250ms), `duration-slow` (400ms), `duration-reveal` (800ms).
- Easings: `ease-default`, `ease-in`, `ease-out`, `ease-in-out`, `ease-reveal`.
- Caret: `animate-caret` (disabled under `prefers-reduced-motion`).

## Shadow

| Token | Utility |
| --- | --- |
| accentGlow | `shadow-accent-glow` |

Used with `.card-lift` for hover glow.

## Z-index

`z-base`, `z-raised`, `z-dropdown`, `z-sticky`, `z-overlay`, `z-modal`, `z-toast`.

## Utilities

- **`bg-grid`**: faint site-wide blueprint grid (≈4–5% line opacity, `--size-grid`).
- **`bg-grid-hero`**: stronger cyan-tinted hero grid on a `::before` layer, faded with a radial mask so it does not cover the whole viewport.
- **`counter-stroke`**: transparent fill + 1px text stroke for outlined counters.
- **`card-lift`**: 1px border, `translateY(-4px)` + cyan glow on hover, motion-token transitions.

## Atoms (`src/components/atoms`)

| Atom | Purpose |
| --- | --- |
| Button | `primary` / `ghost` / `pill`; sizes `sm` / `md` / `lg` — `primary` is the cyan pill CTA |
| Heading | levels 1–6; sizes `default` / `display` / `hero` / `section` |
| Text | `body` / `muted` / `small` |
| MonoLabel | uppercase mono caption |
| Chip | pill tag |
| Link | internal (`next/link`) or external `<a>` |
| Icon | `arrow`, `menu`, `sun`, `moon`, `github`, `linkedin`, `mail`, `x` |
| Input / Textarea | form fields with focus ring |
| Badge | status `default` / `success` / `warning` / `error` |
| VisuallyHidden | screen-reader-only text |
| Container | 12-col page gutter, `max-w-page` (1280px) |
| Divider | horizontal rule |
| Markdown | safe `react-markdown` body renderer |
| SectionCounter | huge outlined section index (`01`) |

Use `cn()` from `@/lib/utils/cn` to merge class names.

## Admin (shadcn)

Admin UI lives in `src/components/admin/ui` and is not used on the public site. shadcn variables (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, sidebar and chart aliases) point at the DLS tokens above. `--primary` is the electric cyan accent.

Public utilities `bg-accent`, `text-muted`, and `border-border` stay on the DLS palette. Inside the generated admin primitives, hover and selected surfaces use `bg-secondary` (the elevated token) so they do not repaint the cyan accent or the muted text color.
