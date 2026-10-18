import type { StoryItem } from "@/lib/schemas/story";

export const storySeed: StoryItem[] = [
  {
    id: "story-2017",
    year: "2017",
    title: "Android freelancer",
    body:
      "First production apps and client work — shipping on tight timelines and learning what reliable mobile delivery looks like.",
    tags: ["Android", "Freelance", "Mobile"],
    order: 0,
    status: "published",
    updatedAt: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "story-2018-2021",
    year: "2018–2021",
    title: "Web & mobile engineer",
    body:
      "Full-stack product work across React, React Native, and Node — from greenfield MVPs to scaling features in production.",
    tags: ["React", "React Native", "Node.js"],
    order: 1,
    status: "published",
    updatedAt: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "story-2022-2024",
    year: "2022–2024",
    title: "Senior software engineer",
    body:
      "Led delivery of web and mobile products for clients — architecture, hands-on implementation, and steady releases.",
    tags: ["Web", "Mobile", "Delivery"],
    order: 2,
    status: "published",
    updatedAt: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "story-2025-now",
    year: "2025–now",
    title: "Building with AI",
    body:
      "GenAI systems, AI-native delivery pipelines, and cloud architecture — with a focus on fintech and open finance.",
    tags: ["GenAI", "Cloud", "Fintech", "Open finance"],
    order: 3,
    status: "published",
    updatedAt: "2026-10-18T00:00:00.000Z",
  },
];
