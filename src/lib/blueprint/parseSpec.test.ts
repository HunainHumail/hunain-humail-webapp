import { describe, expect, it } from "vitest";
import { parseBlueprintSpec } from "./parseSpec";

const looseDraft = {
  appName: "Clinic Queue",
  summary: "Claim a walk-in spot and wait somewhere else.",
  audience: "A parent who needs a same-day pediatric visit",
  mvp: "See open clinics, claim one spot, and get a text when two people are left.",
  assumptions: ["The parent books for one child.", "Clinics publish a live queue."],
  later: ["Payment in the app", "Medical records"],
  platform: "mobile",
  screens: [
    {
      id: "Clinic List",
      title: "Clinics",
      purpose: "See which nearby clinics are taking walk-ins.",
      blocks: [
        { type: "header", label: "Nearby clinics" },
        {
          type: "list",
          label: "Open clinics",
          items: [
            "City Pediatrics — 4 people ahead",
            "Harbour Clinic — 2 people ahead",
            "Walk-in desk — accepting now",
          ],
        },
        { type: "button", label: "View queue" },
      ],
    },
    {
      id: "queue_detail",
      title: "Queue",
      purpose: "Check how many people are ahead of the claimed spot.",
      blocks: [
        { type: "header", label: "Your place" },
        {
          type: "card",
          label: "City Pediatrics has four families ahead of you",
        },
      ],
    },
    {
      id: "Claim Spot",
      title: "Claim",
      purpose: "Hold one spot and leave a phone number for the text.",
      blocks: [
        { type: "header", label: "Claim spot" },
        {
          type: "form",
          label: "Details",
          items: ["Child first name", "Mobile number"],
        },
        { type: "button", label: "Claim this spot" },
      ],
    },
  ],
  features: [
    "Show clinics accepting walk-ins",
    "Claim one spot",
    "Text when two people are left",
  ],
};

describe("parseBlueprintSpec", () => {
  it("accepts a loose Gemini draft by slugging ids and clipping long labels", () => {
    const parsed = parseBlueprintSpec(JSON.stringify(looseDraft), "mobile");
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    expect(parsed.spec.screens.map((screen) => screen.id)).toEqual([
      "clinic-list",
      "queue-detail",
      "claim-spot",
    ]);
    const list = parsed.spec.screens[0]?.blocks[1];
    expect(list?.items?.[0]?.length).toBeLessThanOrEqual(28);
    expect(parsed.spec.screens[1]?.blocks[1]?.label.length).toBeLessThanOrEqual(40);
    expect(parsed.spec.platform).toBe("mobile");
  });

  it("rejects text that is not JSON", () => {
    expect(parseBlueprintSpec("not json", "web")).toEqual({
      ok: false,
      issues: ["json"],
    });
  });
});
