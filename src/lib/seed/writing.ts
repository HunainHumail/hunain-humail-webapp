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
  {
    id: "writing-ai-native-delivery",
    type: "post",
    title: "AI-native delivery",
    venue: "LinkedIn",
    date: "2026-09-12",
    url: "https://www.linkedin.com/in/hunainhumail",
    summary:
      "Prompt to PR — automated build, test, and release so GenAI work ships on a boring, repeatable train.",
    order: 2,
    status: "published",
    updatedAt,
  },
  {
    id: "writing-agentic-sdlc",
    type: "post",
    title: "Agentic SDLC",
    venue: "LinkedIn",
    date: "2026-07-08",
    url: "https://www.linkedin.com/in/hunainhumail",
    summary:
      "Where agents sit in the software loop: specs, patches, tests, and a human gate before production.",
    order: 3,
    status: "published",
    updatedAt,
  },
  {
    id: "writing-production-evals",
    type: "post",
    title: "Production evals for agents",
    venue: "LinkedIn",
    date: "2026-05-20",
    url: "https://www.linkedin.com/in/hunainhumail",
    summary:
      "Placeholder notes on eval harnesses and guardrails that keep agent workflows reliable in production.",
    order: 4,
    status: "published",
    updatedAt,
  },
];
