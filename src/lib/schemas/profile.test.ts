import { describe, expect, it } from "vitest";
import { profileSchema } from "./profile";

const valid = {
  status: "published",
  order: 0,
  updatedAt: "2026-10-18T00:00:00.000Z",
  name: "Hunain Humail",
  headline: "GenAI engineer",
  location: "Dubai",
  chips: ["GenAI Engineer"],
  terminalLines: [{ command: "whoami", output: "hunain" }],
  ctas: [{ label: "View work", href: "#work" }],
};

describe("profileSchema", () => {
  it("defaults avatars to an empty list", () => {
    expect(profileSchema.parse(valid).avatars).toEqual([]);
  });

  it("accepts a relative avatar path", () => {
    const parsed = profileSchema.parse({
      ...valid,
      avatars: [{ src: "/avatar/github.webp", alt: "Hunain Humail" }],
    });
    expect(parsed.avatars).toEqual([
      { src: "/avatar/github.webp", alt: "Hunain Humail" },
    ]);
  });

  it("rejects an avatar that is not a path or https URL", () => {
    const result = profileSchema.safeParse({
      ...valid,
      avatars: [{ src: "ftp://example.com/avatar.webp", alt: "Hunain" }],
    });
    expect(result.success).toBe(false);
  });
});
