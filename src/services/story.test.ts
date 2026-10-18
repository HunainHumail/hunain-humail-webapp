import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { storyRepository } from "@/lib/firebase";
import type { StoryItem } from "@/lib/schemas/story";
import { storySeed } from "@/lib/seed/story";
import { getStory, publishedStoryItems } from "./story";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  storyRepository: {
    listPublished: vi.fn(),
  },
}));

const baseItem: StoryItem = {
  id: "test",
  year: "2020",
  title: "Test",
  body: "Body",
  tags: [],
  order: 0,
  status: "published",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("publishedStoryItems", () => {
  it("filters drafts and sorts by order", () => {
    const items: StoryItem[] = [
      { ...baseItem, id: "b", order: 2, status: "published" },
      { ...baseItem, id: "c", order: 1, status: "draft" },
      { ...baseItem, id: "a", order: 0, status: "published" },
    ];

    const result = publishedStoryItems(items);
    expect(result.map((item) => item.id)).toEqual(["a", "b"]);
  });
});

describe("getStory", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(storyRepository.listPublished).mockReset();
  });

  it("returns published story seed sorted by order", async () => {
    const items = await getStory();
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.status === "published")).toBe(true);
    const orders = items.map((item) => item.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(items[0].year).toBe("2017");
    expect(items.at(-1)?.title).toBe("Building with AI");
    expect(storyRepository.listPublished).not.toHaveBeenCalled();
  });

  it("returns repository items when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(storyRepository.listPublished).mockResolvedValue([
      { ...storySeed[0], title: "From Firestore" },
    ]);

    const items = await getStory();
    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("From Firestore");
  });

  it("falls back to seed when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(storyRepository.listPublished).mockRejectedValue(
      new Error("offline"),
    );

    const items = await getStory();
    expect(items[0]?.year).toBe("2017");
  });
});
