import type { Profile } from "@/lib/schemas/profile";

export const profileSeed: Profile = {
  status: "published",
  order: 0,
  updatedAt: "2026-10-18T00:00:00.000Z",
  name: "Hunain Humail",
  headline:
    "Software engineer building with AI, fintech and open finance.",
  location: "Dubai · 25.20°N 55.27°E",
  chips: [
    "Senior Software Engineer",
    "GenAI Engineer",
    "Fintech & Open Finance",
  ],
  terminalLines: [
    { command: "whoami", output: "hunain — genai engineer" },
    {
      command: "ls ./focus",
      output: "genai  ai-native-delivery  cloud  fintech  open-finance",
    },
    { command: "status", output: "shipping genai" },
  ],
  ctas: [
    { label: "View work", href: "#work" },
    { label: "Get in touch", href: "#contact" },
  ],
};
