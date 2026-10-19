import { describe, expect, it } from "vitest";
import { COLLECTIONS, PROFILE_DOC_ID, SETTINGS_DOC_ID } from "@/lib/firebase/constants";
import { buildSeedImportPayload } from "@/lib/seed/importPayload";
import { nowSeed } from "@/lib/seed/now";
import { profileSeed } from "@/lib/seed/profile";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { storySeed } from "@/lib/seed/story";
import { workSeed } from "@/lib/seed/work";
import { writingImportItems, writingSeed } from "@/lib/seed/writing";
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

  it("gives profile an image-URL avatar list", () => {
    const avatars = getCollectionConfig("profile").fields.find(
      (field) => field.name === "avatars",
    );
    expect(avatars?.type).toBe("records");
    expect(avatars?.fields?.map((field) => field.name)).toEqual(["src", "alt"]);
    expect(avatars?.fields?.find((field) => field.name === "src")?.type).toBe(
      "image",
    );
    expect(getCollectionConfig("profile").createBlank().avatars).toEqual([]);
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

  it("reads the same collection and document ids the import writes", () => {
    const payload = buildSeedImportPayload(() => "2026-10-19T12:00:00.000Z");
    const byCollection = new Map(
      ADMIN_COLLECTION_NAMES.map((name) => [
        name,
        payload.documents.filter((document) => document.collection === name),
      ]),
    );

    expect(getCollectionConfig("profile").singletonId).toBe(PROFILE_DOC_ID);
    expect(getCollectionConfig("settings").singletonId).toBe(SETTINGS_DOC_ID);
    expect(getCollectionConfig("profile").name).toBe(COLLECTIONS.profile);
    expect(getCollectionConfig("work").name).toBe(COLLECTIONS.work);
    expect(getCollectionConfig("writing").name).toBe(COLLECTIONS.writing);
    expect(byCollection.get("profile")?.map((document) => document.id)).toEqual([
      PROFILE_DOC_ID,
    ]);
    expect(byCollection.get("settings")?.map((document) => document.id)).toEqual([
      SETTINGS_DOC_ID,
    ]);
    expect(byCollection.get("work")?.map((document) => document.id)).toEqual(
      workSeed.map((item) => item.id),
    );
    expect(byCollection.get("writing")?.map((document) => document.id)).toEqual(
      writingImportItems().map((item) => item.id),
    );
    expect(byCollection.get("writing")).toHaveLength(
      writingSeed.length + 3,
    );

    for (const document of payload.documents) {
      expect(
        getCollectionConfig(document.collection).schema.safeParse(document.data)
          .success,
      ).toBe(true);
    }
  });

  it("gives writing optional image fields for LinkedIn posts", () => {
    const names = getCollectionConfig("writing").fields.map((field) => field.name);
    expect(names).toEqual(
      expect.arrayContaining(["image", "imageAlt", "url", "type", "summary"]),
    );
    expect(getCollectionConfig("writing").fields.find((field) => field.name === "image")?.type).toBe(
      "image",
    );
  });
});
