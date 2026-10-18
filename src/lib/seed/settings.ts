import type { SiteSettings } from "@/lib/schemas/siteSettings";

export const siteSettingsSeed: SiteSettings = {
  status: "published",
  order: 0,
  updatedAt: "2026-10-18T00:00:00.000Z",
  nav: [
    { number: "01", label: "Story", href: "#story" },
    { number: "02", label: "Now", href: "#now" },
    { number: "03", label: "Work", href: "#work" },
    { number: "04", label: "Writing", href: "#writing" },
    { number: "05", label: "Contact", href: "#contact" },
  ],
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/hunainhumail",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hunainhumail",
      icon: "linkedin",
    },
    {
      label: "Email",
      href: "mailto:raohunain@hotmail.com",
      icon: "mail",
    },
  ],
  contact: {
    email: "raohunain@hotmail.com",
    intro: "Open to freelance builds, consulting and interesting roles.",
    options: ["Freelance", "Consulting", "Roles"],
  },
  seo: {
    title: "Hunain Humail",
    description: "GenAI engineer — fintech and open finance.",
  },
};
