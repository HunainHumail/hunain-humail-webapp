import { describe, expect, it } from "vitest";
import { nowSeed } from "@/lib/seed/now";
import { profileSeed } from "@/lib/seed/profile";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { storySeed } from "@/lib/seed/story";
import { workSeed } from "@/lib/seed/work";
import { writingSeed } from "@/lib/seed/writing";
import {
  ADMIN_COLLECTION_NAMES,
  getCollectionConfig,
} from "./collections";

describe("collection configs", () => {
  it("reuses each collection schema and accepts the seed documents", () => {
    expect(getCollectionConfig("profile").schema.safeParse(profileSeed).success).toBe(
      true,
    );
    expect(getCollectionConfig("story").schema.safeParse(storySeed[0]).success).toBe(
      true,
    );
    expect(getCollectionConfig("now").schema.safeParse(nowSeed[0]).success).toBe(
      true,
    );
    expect(getCollectionConfig("work").schema.safeParse(workSeed[0]).success).toBe(
      true,
    );
    expect(
      getCollectionConfig("writing").schema.safeParse(writingSeed[0]).success,
    ).toBe(true);
    expect(
      getCollectionConfig("settings").schema.safeParse(siteSettingsSeed).success,
    ).toBe(true);
  });

  it("gives work a markdown body, cover image, and gallery list", () => {
    const fields = getCollectionConfig("work").fields;
    expect(fields.find((field) => field.name === "body")?.type).toBe("markdown");
    expect(fields.find((field) => field.name === "coverUrl")?.type).toBe("image");
    const gallery = fields.find((field) => field.name === "gallery");
    expect(gallery?.type).toBe("records");
    expect(gallery?.fields?.map((field) => field.name)).toEqual([
      "src",
      "alt",
      "caption",
    ]);
    expect(gallery?.fields?.find((field) => field.name === "src")?.type).toBe(
      "image",
    );
  });

  it("covers settings nav, socials, contact, and SEO", () => {
    const names = getCollectionConfig("settings").fields.map((field) => field.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "nav",
        "socials",
        "contact.email",
        "contact.intro",
        "contact.options",
        "seo.title",
        "seo.description",
        "seo.ogImage",
      ]),
    );
  });

  it("starts every blank document as a draft", () => {
    for (const name of ADMIN_COLLECTION_NAMES) {
      expect(getCollectionConfig(name).createBlank().status).toBe("draft");
    }
  });
});
