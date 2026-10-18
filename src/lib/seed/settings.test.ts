import { describe, expect, it } from "vitest";
import { siteSettingsSchema } from "@/lib/schemas/siteSettings";
import { nowSeed } from "./now";
import { profileSeed } from "./profile";
import { siteSettingsSeed } from "./settings";
import { storySeed } from "./story";
import { workSeed } from "./work";
import { writingSeed } from "./writing";

const LINKEDIN = "https://www.linkedin.com/in/hunain-humail";

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

describe("siteSettingsSeed socials", () => {
  it("uses absolute github, linkedin, and mailto urls", () => {
    expect(() => siteSettingsSchema.parse(siteSettingsSeed)).not.toThrow();
    expect(siteSettingsSeed.socials).toEqual([
      {
        label: "GitHub",
        href: "https://github.com/hunainhumail",
        icon: "github",
      },
      {
        label: "LinkedIn",
        href: LINKEDIN,
        icon: "linkedin",
      },
      {
        label: "Email",
        href: "mailto:raohunain@hotmail.com",
        icon: "mail",
      },
    ]);

    for (const social of siteSettingsSeed.socials) {
      expect(social.href.startsWith("/")).toBe(false);
      expect(social.href.endsWith("/")).toBe(false);
    }
  });

  it("points every linkedin.com reference at the profile", () => {
    const urls = [
      siteSettingsSeed,
      profileSeed,
      storySeed,
      nowSeed,
      workSeed,
      writingSeed,
    ]
      .flatMap(collectStrings)
      .filter((value) => value.includes("linkedin.com"));

    expect(urls.length).toBeGreaterThan(0);
    expect(new Set(urls)).toEqual(new Set([LINKEDIN]));
  });
});
