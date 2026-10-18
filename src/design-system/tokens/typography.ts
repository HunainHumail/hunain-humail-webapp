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
  "mono-md": ["0.9375rem", { lineHeight: "1.6" }],
  "display-xl": [
    "clamp(64px, 9vw, 128px)",
    { lineHeight: "0.88", letterSpacing: "-0.05em" },
  ],
  "display-hero": [
    "clamp(64px, 9vw, 128px)",
    { lineHeight: "0.88", letterSpacing: "-0.05em" },
  ],
  "display-section": [
    "clamp(2.75rem, 5vw, 3.75rem)",
    { lineHeight: "0.92", letterSpacing: "-0.03em" },
  ],
  "display-counter": [
    "clamp(4.5rem, 10vw, 8rem)",
    { lineHeight: "0.8", letterSpacing: "-0.06em" },
  ],
} as const;

export const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.03em",
  normal: "0",
  wide: "0.14em",
} as const;
