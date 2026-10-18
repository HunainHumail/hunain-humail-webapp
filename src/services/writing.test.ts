import { describe, expect, it } from "vitest";
import type { WritingItem } from "@/lib/schemas/writing";
import { getWriting, publishedWritingItems } from "./writing";

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
  it("filters drafts and sorts by order", () => {
    const items: WritingItem[] = [
      { ...baseItem, id: "b", order: 2, status: "published" },
      { ...baseItem, id: "c", order: 1, status: "draft" },
      { ...baseItem, id: "a", order: 0, status: "published" },
    ];

    expect(publishedWritingItems(items).map((item) => item.id)).toEqual([
      "a",
      "b",
    ]);
  });
});

describe("getWriting", () => {
  it("returns published writing seed sorted by order", async () => {
    const items = await getWriting();
    expect(items).toHaveLength(5);
    expect(items.every((item) => item.status === "published")).toBe(true);
    expect(items.map((item) => item.order)).toEqual([0, 1, 2, 3, 4]);
    expect(items.map((item) => item.title)).toEqual([
      "Speaker",
      "Winner",
      "AI-native delivery",
      "Agentic SDLC",
      "Production evals for agents",
    ]);
    expect(items.map((item) => item.type)).toEqual([
      "talk",
      "award",
      "post",
      "post",
      "post",
    ]);
    expect(items[0]?.venue).toBe("GDG DevFest Sindh 2023");
    expect(items[1]?.venue).toBe("Google Hackathon 2020");
  });
});
