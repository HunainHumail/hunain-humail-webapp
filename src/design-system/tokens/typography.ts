/** Typography scale — mirrored in Tailwind `fontSize` theme. */
export const fontFamily = {
  display: "var(--font-space-grotesk)",
  sans: "var(--font-space-grotesk)",
  mono: "var(--font-mono)",
} as const;

export const fontSize = {
  xs: ["0.75rem", { lineHeight: "1rem" }],
  sm: ["0.875rem", { lineHeight: "1.25rem" }],
  base: ["1rem", { lineHeight: "1.5rem" }],
  lg: ["1.125rem", { lineHeight: "1.75rem" }],
  xl: ["1.25rem", { lineHeight: "1.75rem" }],
  "2xl": ["1.5rem", { lineHeight: "2rem" }],
  "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
  "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
  "display-xl": [
    "clamp(3rem, 8vw, 5.5rem)",
    { lineHeight: "0.9", letterSpacing: "-0.04em" },
  ],
} as const;

export const letterSpacing = {
  tight: "-0.04em",
  normal: "0",
  wide: "0.12em",
} as const;
