import type { Profile, ProfileAvatarItem } from "@/lib/schemas/profile";
import { generatedAvatarNames } from "./avatarManifest";

const AVATARS_BY_NAME: Record<string, ProfileAvatarItem> = {
  github: {
    src: "/avatar/github.webp",
    alt: "Hunain Humail",
  },
  linkedin: {
    src: "/avatar/linkedin.webp",
    alt: "Hunain Humail",
  },
};

function seedAvatars(): ProfileAvatarItem[] {
  return generatedAvatarNames.flatMap((name) => {
    const avatar = AVATARS_BY_NAME[name];
    return avatar ? [avatar] : [];
  });
}

export const profileSeed: Profile = {
  status: "published",
  order: 0,
  updatedAt: "2026-10-18T00:00:00.000Z",
  name: "Hunain Humail",
  headline:
    "Software engineer building with AI, fintech and open finance.",
  location: "Dubai · 25.20°N 55.27°E",
  avatars: seedAvatars(),
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
