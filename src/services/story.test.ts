import { describe, expect, it } from "vitest";
import type { StoryItem } from "@/lib/schemas/story";
import { getStory, publishedStoryItems } from "./story";

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
  it("returns published story seed sorted by order", async () => {
    const items = await getStory();
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.status === "published")).toBe(true);
    const orders = items.map((item) => item.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(items[0].year).toBe("2017");
    expect(items.at(-1)?.title).toBe("Building with AI");
  });
});
