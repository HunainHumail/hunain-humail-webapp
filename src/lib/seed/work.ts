import type { WorkItem } from "@/lib/schemas/work";

const updatedAt = "2026-10-18T00:00:00.000Z";

export const workSeed: WorkItem[] = [
  {
    id: "work-trinnect",
    slug: "trinnect",
    title: "Trinnect",
    category: "products",
    summary:
      "AI-native product with an automated pipeline from prompt to tested web and mobile releases.",
    role: "GenAI engineer",
    stack: ["TypeScript", "Next.js", "React Native", "Node.js"],
    highlights: [
      "Prompt-to-build automation for web and mobile",
      "Shared test gate before every deploy",
      "Repeatable release path from a single pipeline",
    ],
    body: `## What I built

Trinnect is an AI-native product. I built the automated pipeline that takes a prompt through build, test, and deploy for web and mobile.

## Pipeline

1. Prompt defines the change
2. Build and tests run in CI
3. Web and mobile ship from the same train

The work is delivery infrastructure: keep the loop tight, keep releases predictable.`,
    order: 0,
    status: "published",
    featured: true,
    updatedAt,
  },
  {
    id: "work-terranzo",
    slug: "terranzo",
    title: "Terranzo",
    category: "products",
    summary:
      "Product surface shipped through the same prompt → build → test → deploy loop.",
    role: "GenAI engineer",
    stack: ["TypeScript", "React", "Node.js", "Firebase"],
    highlights: [
      "AI-native delivery for a product team",
      "Automated checks on every prompt-driven change",
      "Web release path wired to the same pipeline",
    ],
    body: `## What I built

Terranzo is an AI-native product. I owned the automated pipeline so product changes move from prompt to a tested deploy without a hand-rolled release ritual.

## Role

GenAI engineer on the delivery loop — prompts in, verified web builds out.`,
    order: 1,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-isense-my-float",
    slug: "isense-my-float",
    title: "iSense My Float",
    category: "client-apps",
    summary:
      "Client app where web and mobile ship from one automated, prompt-driven pipeline.",
    role: "GenAI engineer — client delivery",
    stack: ["TypeScript", "React Native", "Next.js", "Firebase"],
    highlights: [
      "Client web and mobile on a shared pipeline",
      "Prompt-driven changes with automated tests",
      "Deploy path that stays the same each release",
    ],
    body: `## What I built

iSense My Float is a client app. I set up the automated pipeline so a prompt can move through build, test, and deploy for both web and mobile.

## Outcome

A client-facing surface that ships on a repeatable AI-native train instead of ad-hoc releases.`,
    order: 2,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-fastbrix",
    slug: "fastbrix",
    title: "Fastbrix",
    category: "ai-systems",
    summary:
      "AI system and delivery rails: prompt in, tested web and mobile builds out.",
    role: "GenAI engineer",
    stack: ["TypeScript", "Python", "Next.js", "CI"],
    highlights: [
      "Automated prompt-to-PR path",
      "Eval and test gates in the pipeline",
      "Web and mobile deploy as a single step",
    ],
    body: `## What I built

Fastbrix is an AI-native system. I built the automated pipelines that take a prompt through build, test, and deploy for web and mobile.

## System shape

The interesting part is the glue: agents, checks, and a release path that stays boring on purpose.`,
    order: 3,
    status: "published",
    featured: false,
    updatedAt,
  },
  {
    id: "work-vigil",
    slug: "vigil",
    title: "Vigil",
    category: "ai-systems",
    summary:
      "AI-native product with automated pipelines from prompt to web and mobile deploy.",
    role: "GenAI engineer",
    stack: ["TypeScript", "Next.js", "Node.js", "Cloud"],
    highlights: [
      "End-to-end prompt → build → test → deploy",
      "Shared quality gate for web and mobile",
      "Pipeline designed for frequent, small releases",
    ],
    body: `## What I built

Vigil is an AI-native product. I built the automated pipelines that carry a prompt through build, test, and deploy for web and mobile.

## Why it matters

When the pipeline is the product, shipping stays fast and the checks stay in front of production.`,
    order: 4,
    status: "published",
    featured: true,
    updatedAt,
  },
  {
    id: "work-open-finance",
    slug: "open-finance-project",
    title: "Open finance project",
    category: "fintech",
    summary:
      "Placeholder case study for open-finance work — GenAI systems on financial data rails.",
    role: "GenAI engineer — open finance",
    stack: ["TypeScript", "Node.js", "Cloud", "Open finance APIs"],
    highlights: [
      "Placeholder for open-finance delivery",
      "GenAI systems on regulated data rails",
      "Same AI-native pipeline discipline as product work",
    ],
    body: `## Placeholder

Open finance project is a placeholder case study. Copy will land from the CMS.

## Focus

GenAI engineering for open finance — automated delivery, careful data boundaries, and production-ready pipelines.`,
    order: 5,
    status: "published",
    featured: false,
    updatedAt,
  },
];
