import { afterEach, describe, expect, it } from "vitest";
import { profileSeed } from "@/lib/seed/profile";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { storySeed } from "@/lib/seed/story";
import { workSeed } from "@/lib/seed/work";
import { writingSeed } from "@/lib/seed/writing";
import {
  mergeLiveContent,
  resetLiveContentCache,
} from "./liveContent";

afterEach(() => {
  resetLiveContentCache();
});

describe("mergeLiveContent", () => {
  it("overrides seed work by slug and keeps unpublished live docs out", () => {
    const seed = workSeed[0];
    if (!seed) {
      throw new Error("Expected work seed");
    }

    const merged = mergeLiveContent("work", workSeed, [
      { ...seed, title: "From CMS", gallery: seed.gallery },
      {
        ...seed,
        id: "work-draft",
        slug: "draft-only",
        title: "Draft",
        status: "draft",
      },
    ]);

    expect(merged.find((item) => item.slug === seed.slug)?.title).toBe(
      "From CMS",
    );
    expect(merged.some((item) => item.slug === "draft-only")).toBe(false);
    expect(merged).toHaveLength(workSeed.length);
  });

  it("keeps profile, settings, and writing static when live data is empty or draft", () => {
    expect(mergeLiveContent("profile", profileSeed, null)).toEqual(profileSeed);
    expect(
      mergeLiveContent("profile", profileSeed, {
        ...profileSeed,
        status: "draft",
        headline: "Hidden",
      }),
    ).toEqual(profileSeed);
    expect(mergeLiveContent("settings", siteSettingsSeed, [])).toEqual(
      siteSettingsSeed,
    );
    expect(mergeLiveContent("writing", writingSeed, [])).toEqual(writingSeed);
    expect(mergeLiveContent("story", storySeed, [])).toEqual(storySeed);
  });
});
