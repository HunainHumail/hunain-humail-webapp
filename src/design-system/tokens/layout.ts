/** Page shell — mirrored in `src/app/globals.css` (`--max-width-page`, `--spacing-gutter`). */
export const layout = {
  /** ~1440px. Utility: `max-w-page`. */
  page: "90rem",
  /** Side padding. Utility: `px-gutter`. */
  gutter: "clamp(20px, 4vw, 64px)",
} as const;

export type LayoutToken = keyof typeof layout;
