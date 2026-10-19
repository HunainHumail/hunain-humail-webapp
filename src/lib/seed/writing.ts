import type { WritingItem } from "@/lib/schemas/writing";

const updatedAt = "2026-10-18T00:00:00.000Z";

export const writingSeed: WritingItem[] = [
  {
    id: "writing-devfest-sindh-2023",
    type: "talk",
    title: "Speaker",
    venue: "GDG DevFest Sindh 2023",
    date: "2023-12-16",
    summary:
      "A session at GDG DevFest Sindh on shipping GenAI systems with automated, production-ready pipelines.",
    order: 0,
    status: "published",
    updatedAt,
  },
  {
    id: "writing-google-hackathon-2020",
    type: "award",
    title: "Winner",
    venue: "Google Hackathon 2020",
    date: "2020-08-01",
    summary:
      "Winner of a Google Hackathon — a product sprint that shipped a working prototype under a tight deadline.",
    order: 1,
    status: "published",
    updatedAt,
  },
];
