import { layout } from "./layout";

/** Spacing scale (rem) — mirrored in Tailwind `spacing` theme. */
export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  40: "10rem",
  gutter: layout.gutter,
  section: "5rem",
  "section-lg": "8.5rem",
  terminal: "27.5rem",
  avatar: "6rem",
  lift: "0.25rem",
} as const;
