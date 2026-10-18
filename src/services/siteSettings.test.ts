import { describe, expect, it } from "vitest";
import { getSiteSettings } from "./siteSettings";

describe("getSiteSettings", () => {
  it("returns validated seed settings", async () => {
    const settings = await getSiteSettings();
    expect(settings.nav).toHaveLength(5);
    expect(settings.nav[0].label).toBe("Story");
    expect(settings.socials.length).toBeGreaterThan(0);
  });
});
