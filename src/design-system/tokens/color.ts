/** Semantic color values — mirrored in `globals.css` CSS variables. */
export const colorDark = {
  bg: "#0a0e14",
  surface: "#111820",
  elevated: "#161d27",
  border: "rgba(255, 255, 255, 0.08)",
  text: "#f1f5f9",
  muted: "#94a3b8",
  accent: "#22d3ee",
  accentContrast: "#0a0e14",
  accentComplement: "#ee22d3",
  grid: "rgba(255, 255, 255, 0.05)",
  gridHero: "rgba(34, 211, 238, 0.08)",
  glow: "rgba(34, 211, 238, 0.32)",
  focusRing: "#22d3ee",
} as const;

export const colorLight = {
  bg: "#f8f6f1",
  surface: "#ffffff",
  elevated: "#f1efe8",
  border: "rgba(10, 14, 20, 0.1)",
  text: "#0f172a",
  muted: "#64748b",
  accent: "#22d3ee",
  accentContrast: "#0a0e14",
  accentComplement: "#ee22d3",
  grid: "rgba(10, 14, 20, 0.04)",
  gridHero: "rgba(8, 145, 178, 0.055)",
  glow: "rgba(8, 145, 178, 0.22)",
  focusRing: "#0891b2",
} as const;

export type ColorToken = keyof typeof colorDark;
