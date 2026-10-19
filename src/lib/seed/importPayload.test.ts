import { describe, expect, it } from "vitest";
import { linkedinPosts } from "@/content/linkedin-posts";
import {
  ADMIN_COLLECTION_NAMES,
  getCollectionConfig,
} from "@/lib/admin/collections";
import { COLLECTIONS, PROFILE_DOC_ID, SETTINGS_DOC_ID } from "@/lib/firebase/constants";
import { LINKEDIN_PROFILE_URL } from "@/lib/utils/rewriteLinkedInUrls";
import { stripUndefined } from "@/lib/utils/stripUndefined";
import {
  FIRESTORE_WRITE_CHUNK_SIZE,
  buildSeedImportPayload,
  formatSeedImportSummary,
} from "./importPayload";
import { nowSeed } from "./now";
import { profileSeed } from "./profile";
import { storySeed } from "./story";
import { workSeed } from "./work";
import { writingImportItems, writingSeed } from "./writing";

const FIXED = "2026-10-19T12:00:00.000Z";

function docs(
  payload: ReturnType<typeof buildSeedImportPayload>,
  collection: (typeof ADMIN_COLLECTION_NAMES)[number],
) {
  return payload.documents.filter((document) => document.collection === collection);
}

describe("buildSeedImportPayload", () => {
  it("covers every admin collection with the site seed counts", () => {
    const payload = buildSeedImportPayload(() => FIXED);

    expect(payload.counts).toEqual({
      profile: 1,
      story: storySeed.length,
      now: nowSeed.length,
      work: 30,
      writing: writingSeed.length + linkedinPosts.length,
      testimonials: 0,
      settings: 1,
    });
    expect(payload.counts.work).toBe(workSeed.length);
    expect(payload.counts.writing).toBe(writingImportItems().length);
    expect(payload.counts.writing).toBe(5);
    expect(payload.documents).toHaveLength(1 + 1 + 4 + 4 + 30 + 5);
    expect(FIRESTORE_WRITE_CHUNK_SIZE).toBeLessThanOrEqual(450);
  });

  it("uses the same collection names and singleton ids as admin editors", () => {
    const payload = buildSeedImportPayload(() => FIXED);
    const names = [
      ...new Set(payload.documents.map((document) => document.collection)),
    ].sort();

    expect(names).toEqual(
      [...ADMIN_COLLECTION_NAMES]
        .filter((name) => payload.counts[name] > 0)
        .sort(),
    );
    expect(payload.counts.testimonials).toBe(0);
    expect(docs(payload, "testimonials")).toEqual([]);
    expect(getCollectionConfig("profile").name).toBe(COLLECTIONS.profile);
    expect(getCollectionConfig("settings").name).toBe(COLLECTIONS.settings);
    expect(getCollectionConfig("story").name).toBe(COLLECTIONS.story);
    expect(getCollectionConfig("now").name).toBe(COLLECTIONS.now);
    expect(getCollectionConfig("work").name).toBe(COLLECTIONS.work);
    expect(getCollectionConfig("writing").name).toBe(COLLECTIONS.writing);

    expect(docs(payload, "profile")[0]?.id).toBe(PROFILE_DOC_ID);
    expect(docs(payload, "profile")[0]?.id).toBe(
      getCollectionConfig("profile").singletonId,
    );
    expect(docs(payload, "settings")[0]?.id).toBe(SETTINGS_DOC_ID);
    expect(docs(payload, "settings")[0]?.id).toBe(
      getCollectionConfig("settings").singletonId,
    );
    expect(docs(payload, "work").map((document) => document.id)).toEqual(
      workSeed.map((item) => item.id),
    );
    expect(docs(payload, "writing").map((document) => document.id)).toEqual(
      writingImportItems().map((item) => item.id),
    );
  });

  it("parses every document with the matching admin schema", () => {
    const payload = buildSeedImportPayload(() => FIXED);

    for (const document of payload.documents) {
      const parsed = getCollectionConfig(document.collection).schema.safeParse(
        document.data,
      );
      expect(parsed.success, `${document.collection}/${document.id}`).toBe(true);
      expect(document.data.updatedAt).toBe(FIXED);
      expect(document.data.status).toBe("published");
      expect(document.data).toEqual(stripUndefined(document.data));
    }
  });

  it("imports profile avatars, chips, and terminal lines", () => {
    const profile = docs(buildSeedImportPayload(() => FIXED), "profile")[0];
    expect(profile?.data.name).toBe(profileSeed.name);
    expect(profile?.data.avatars).toEqual(profileSeed.avatars);
    expect(profile?.data.chips).toEqual(profileSeed.chips);
    expect(profile?.data.terminalLines).toEqual(profileSeed.terminalLines);
  });

  it("imports settings nav, LinkedIn, contact email, and SEO", () => {
    const settings = docs(buildSeedImportPayload(() => FIXED), "settings")[0];
    const socials = settings?.data.socials;
    expect(Array.isArray(socials)).toBe(true);
    expect(socials).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "LinkedIn",
          href: LINKEDIN_PROFILE_URL,
        }),
      ]),
    );
    expect(settings?.data).toEqual(
      expect.objectContaining({
        nav: expect.any(Array),
        contact: expect.objectContaining({
          email: "raohunain@hotmail.com",
        }),
        seo: expect.objectContaining({
          title: "Hunain Humail",
        }),
      }),
    );
  });

  it("imports all 30 work items including the VPN gallery and featured order", () => {
    const work = docs(buildSeedImportPayload(() => FIXED), "work");
    expect(work).toHaveLength(30);

    const vpn = work.find((document) => document.id === "work-white-label-vpn-sdk");
    expect(vpn?.data.title).toBe("White Label VPN SDK");
    expect(vpn?.data.gallery).toHaveLength(33);

    const featured = work
      .filter((document) => document.data.featured === true)
      .sort(
        (a, b) => Number(a.data.order) - Number(b.data.order),
      )
      .map((document) => document.data.slug);
    expect(featured).toEqual([
      "trinnect",
      "terranzo",
      "my-float",
      "fast-brix",
      "vigil",
    ]);
  });

  it("imports talks, awards, and the three LinkedIn posts", () => {
    const writing = docs(buildSeedImportPayload(() => FIXED), "writing");
    expect(writing.filter((document) => document.data.type === "post")).toHaveLength(
      3,
    );
    expect(writing.filter((document) => document.data.type === "talk")).toHaveLength(
      1,
    );
    expect(writing.filter((document) => document.data.type === "award")).toHaveLength(
      1,
    );
    expect(writing[0]?.data.title).toBe(linkedinPosts[0]?.title);
    expect(writing[0]?.data.url).toBe(linkedinPosts[0]?.url);
    expect(writing[0]?.data.image).toBe(linkedinPosts[0]?.image);
  });
});

describe("formatSeedImportSummary", () => {
  it("lists per-collection counts", () => {
    const payload = buildSeedImportPayload(() => FIXED);
    expect(formatSeedImportSummary(payload.counts)).toBe(
      "Imported profile 1, story 4, now 4, work 30, writing 5, testimonials 0, settings 1.",
    );
  });
});
