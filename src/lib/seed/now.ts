import type { NowItem } from "@/lib/schemas/now";

export const nowSeed: NowItem[] = [
  {
    id: "now-building",
    label: "Building",
    title: "Something new",
    body: "A new product direction — scoped, designed, and shipped in tight loops with AI-native tooling.",
    order: 0,
    status: "published",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "now-exploring",
    label: "Exploring",
    title: "Agentic workflows",
    body: "Multi-step agents, eval harnesses, and guardrails for reliable automation in production.",
    order: 1,
    status: "published",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "now-shipping",
    label: "Shipping",
    title: "AI-native delivery pipelines for clients",
    body: "From prompt to PR — CI, review, and release patterns that keep GenAI work predictable for teams.",
    order: 2,
    status: "published",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "now-reading",
    label: "Reading",
    title: "Placeholder",
    body: "Notes and links — updated from the CMS when something sticks.",
    order: 3,
    status: "published",
    updatedAt: "2026-10-01T00:00:00.000Z",
  },
];
