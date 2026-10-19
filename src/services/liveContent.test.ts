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
    expect(mergeLiveContent("testimonials", [], [])).toEqual([]);
  });

  it("adds published testimonials from live data and skips drafts", () => {
    const published = {
      id: "t-live",
      name: "Ada Lovelace",
      role: "Engineering lead",
      source: "upwork" as const,
      text: "Shipped the agent.",
      rating: 5,
      date: "2026-03-01",
      order: 0,
      status: "published" as const,
      updatedAt: "2026-10-18T00:00:00.000Z",
    };

    const merged = mergeLiveContent("testimonials", [], [
      published,
      { ...published, id: "t-draft", status: "draft", order: 1 },
    ]);

    expect(merged.map((item) => item.id)).toEqual(["t-live"]);
    expect(merged[0]?.rating).toBe(5);
  });
});
