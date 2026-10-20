import type { BlueprintContent } from "@/lib/schemas/blueprint";
import type { BlueprintErrorKind } from "@/lib/blueprint/errors";

const errors: Record<BlueprintErrorKind, string> = {
  "invalid-input": "Check your email and idea, then try again.",
  "rate-limit": "Too many blueprints this hour. Try again later.",
  "daily-budget": "Blueprint generator is busy today. Try again tomorrow.",
  "provider-quota": "AI capacity is limited right now. Try again soon.",
  timeout: "That took too long. Try again with a shorter idea.",
  "invalid-output": "Could not draft a blueprint. Try again.",
  "app-check": "Security check failed. Refresh and try again.",
  offline: "You appear to be offline. Reconnect and try again.",
  unavailable: "Blueprint generator is not available right now.",
  unknown: "Something went wrong. Try again.",
};

export const blueprintSampleSpecMobile = {
  appName: "Neighbour Cut",
  summary: "Book a barber nearby, then get a reminder before the visit.",
  audience: "Someone who wants a haircut without calling around",
  mvp: "Find a nearby shop, pick one service, and confirm a single slot.",
  assumptions: [
    "The visitor books for themselves.",
    "Each shop lists services and open slots.",
    "Payment happens at the shop.",
  ],
  later: [
    "In-app payment and tips",
    "Reviews and loyalty",
    "A shop owner dashboard",
  ],
  platform: "mobile" as const,
  screens: [
    {
      id: "home",
      title: "Nearby",
      purpose: "Pick a shop from barbers that are open today.",
      blocks: [
        { type: "header" as const, label: "Nearby" },
        {
          type: "list" as const,
          label: "Shops",
          items: ["Fade Room", "North Clip", "Walk-in"],
        },
        { type: "button" as const, label: "View shop" },
        { type: "tabbar" as const, label: "Home" },
      ],
    },
    {
      id: "shop",
      title: "Shop",
      purpose: "Check the service and the next open slots.",
      blocks: [
        { type: "header" as const, label: "Fade Room" },
        { type: "card" as const, label: "Skin fade · 45 min" },
        {
          type: "list" as const,
          label: "Slots",
          items: ["Today 16:30", "Today 18:00", "Fri 11:00"],
        },
        { type: "button" as const, label: "Choose slot" },
        { type: "tabbar" as const, label: "Home" },
      ],
    },
    {
      id: "book",
      title: "Confirm",
      purpose: "Confirm the visit so a reminder can be sent.",
      blocks: [
        { type: "header" as const, label: "Confirm" },
        {
          type: "form" as const,
          label: "Visit",
          items: ["Your name", "Service", "Time"],
        },
        { type: "button" as const, label: "Confirm visit" },
        { type: "tabbar" as const, label: "Home" },
      ],
    },
  ],
  features: [
    "List shops open today",
    "Show the next three slots",
    "Save the visit and send a reminder",
  ],
};

export const blueprintContentSeed: BlueprintContent = {
  eyebrow: "Blueprint",
  title: "Blueprint your idea.",
  intro:
    "Describe an app idea. You get a first version: who it is for, what ships, what waits, and a wireframe of that flow.",
  consent: "Your email and idea are saved and reviewed by Hunain.",
  emailLabel: "Email",
  ideaLabel: "Your idea",
  platformLabel: "Platform",
  submitLabel: "Generate blueprint",
  loadingLabel: "Drafting your blueprint",
  discussLabel: "Discuss this with Hunain",
  copyLabel: "Copy plan",
  retryLabel: "Try again",
  errors,
  examples: [
    "A booking app for a neighbourhood barber",
    "A shared grocery list for families",
    "A dashboard to track invoices for freelancers",
  ],
  sample: blueprintSampleSpecMobile,
};
