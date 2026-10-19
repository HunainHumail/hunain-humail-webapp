import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { profileSchema } from "@/lib/schemas/profile";
import { profileSeed } from "./profile";

describe("profileSeed", () => {
  it("parses and seeds the github avatar", () => {
    const parsed = profileSchema.parse(profileSeed);
    expect(parsed.avatars[0]).toEqual({
      src: "/avatar/github.webp",
      alt: "Hunain Humail",
    });
    expect(
      parsed.avatars.some((avatar) => avatar.src === "/avatar/linkedin.webp"),
    ).toBe(
      existsSync(
        path.resolve(process.cwd(), "public", "avatar", "linkedin.webp"),
      ),
    );
  });

  it("points every avatar src at a file in public", () => {
    expect(profileSeed.avatars.length).toBeGreaterThan(0);
    for (const avatar of profileSeed.avatars) {
      expect(avatar.src.startsWith("/")).toBe(true);
      expect(
        existsSync(path.resolve(process.cwd(), "public", avatar.src.replace(/^\//u, ""))),
      ).toBe(true);
    }
  });
});
