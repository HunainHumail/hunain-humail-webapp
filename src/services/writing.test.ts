import { afterEach, describe, expect, it, vi } from "vitest";
import { linkedinPosts } from "@/content/linkedin-posts";
import { isFirebaseConfigured } from "@/lib/env";
import { writingRepository } from "@/lib/firebase";
import type { WritingItem } from "@/lib/schemas/writing";
import { writingSeed } from "@/lib/seed/writing";
import { LINKEDIN_PROFILE_URL } from "@/lib/utils/rewriteLinkedInUrls";
import {
  getLinkedInWritingItems,
  getWriting,
  mergeLinkedInPosts,
  publishedWritingItems,
} from "./writing";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  writingRepository: {
    listPublished: vi.fn(),
  },
}));

const baseItem: WritingItem = {
  id: "test",
  type: "post",
  title: "Test",
  venue: "LinkedIn",
  date: "2026-01-01",
  summary: "Summary",
  order: 0,
  status: "published",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("publishedWritingItems", () => {
  it("filters drafts and sorts posts newest first, then talks/awards by order", () => {
    const items: WritingItem[] = [
      { ...baseItem, id: "old-post", date: "2026-01-01", type: "post", order: 0 },
      { ...baseItem, id: "talk", type: "talk", order: 2, status: "published" },
      { ...baseItem, id: "draft", order: 1, status: "draft" },
      { ...baseItem, id: "new-post", date: "2026-10-16", type: "post", order: 9 },
      { ...baseItem, id: "award", type: "award", order: 1, status: "published" },
    ];

    expect(publishedWritingItems(items).map((item) => item.id)).toEqual([
      "new-post",
      "old-post",
      "award",
      "talk",
    ]);
  });
});

describe("mergeLinkedInPosts", () => {
  it("replaces placeholder posts with the data-file posts newest first", () => {
    const merged = mergeLinkedInPosts([
      ...writingSeed,
      { ...baseItem, id: "placeholder", title: "AI-native delivery" },
    ]);

    expect(merged.filter((item) => item.type === "post")).toHaveLength(
      linkedinPosts.length,
    );
    expect(merged.slice(0, 3).map((item) => item.title)).toEqual(
      linkedinPosts.map((post) => post.title),
    );
    expect(merged.slice(0, 3).every((item) => item.type === "post")).toBe(true);
    expect(merged[3]?.venue).toBe("GDG DevFest Sindh 2023");
    expect(merged[4]?.venue).toBe("Google Hackathon 2020");
    expect(merged.some((item) => item.id === "placeholder")).toBe(false);
  });
});

describe("getWriting", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(writingRepository.listPublished).mockReset();
  });

  it("returns LinkedIn posts newest first, then talks and awards", async () => {
    const items = await getWriting();
    const expectedPosts = getLinkedInWritingItems();

    expect(items).toHaveLength(expectedPosts.length + writingSeed.length);
    expect(items.every((item) => item.status === "published")).toBe(true);
    expect(items.slice(0, 3).map((item) => item.type)).toEqual([
      "post",
      "post",
      "post",
    ]);
    expect(items.slice(0, 3).map((item) => item.title)).toEqual(
      linkedinPosts.map((post) => post.title),
    );
    expect(items.slice(0, 3).map((item) => item.url)).toEqual(
      linkedinPosts.map((post) => post.url),
    );
    expect(items.slice(0, 3).map((item) => item.date)).toEqual([
      "2026-10-16",
      "2026-10-05",
      "2026-09-26",
    ]);
    expect(items.map((item) => item.type)).toEqual([
      "post",
      "post",
      "post",
      "talk",
      "award",
    ]);
    expect(items[3]?.venue).toBe("GDG DevFest Sindh 2023");
    expect(items[4]?.venue).toBe("Google Hackathon 2020");
    expect(writingRepository.listPublished).not.toHaveBeenCalled();
  });

  it("keeps Firestore talks and overlays data-file posts", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(writingRepository.listPublished).mockResolvedValue([
      { ...writingSeed[0], title: "From Firestore" },
    ]);

    const items = await getWriting();
    expect(items.find((item) => item.type === "talk")?.title).toBe(
      "From Firestore",
    );
    expect(items.filter((item) => item.type === "post")).toHaveLength(3);
    expect(items[0]?.title).toBe(linkedinPosts[0]?.title);
  });

  it("does not rewrite LinkedIn activity permalinks to the profile", async () => {
    const items = await getWriting();
    const posts = items.filter((item) => item.type === "post");
    expect(posts.map((item) => item.url)).toEqual(
      linkedinPosts.map((post) => post.url),
    );
    expect(posts.every((item) => item.url !== LINKEDIN_PROFILE_URL)).toBe(true);
  });

  it("falls back to seed talks plus data-file posts when the collection is empty", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(writingRepository.listPublished).mockResolvedValue([]);

    const items = await getWriting();
    expect(items).toHaveLength(linkedinPosts.length + writingSeed.length);
  });

  it("falls back to seed talks plus data-file posts when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(writingRepository.listPublished).mockRejectedValue(
      new Error("offline"),
    );

    const items = await getWriting();
    expect(items).toHaveLength(linkedinPosts.length + writingSeed.length);
  });
});
