import { describe, expect, it } from "vitest";
import type { NowItem } from "@/lib/schemas/now";
import { getNow, publishedNowItems } from "./now";

const baseItem: NowItem = {
  id: "test",
  label: "Building",
  title: "Test",
  body: "Body",
  order: 0,
  status: "published",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("publishedNowItems", () => {
  it("filters drafts and sorts by order", () => {
    const items: NowItem[] = [
      { ...baseItem, id: "b", order: 2, status: "published" },
      { ...baseItem, id: "c", order: 1, status: "draft" },
      { ...baseItem, id: "a", order: 0, status: "published" },
    ];

    const result = publishedNowItems(items);
    expect(result.map((item) => item.id)).toEqual(["a", "b"]);
  });
});

describe("getNow", () => {
  it("returns published now seed sorted by order", async () => {
    const items = await getNow();
    expect(items.length).toBe(4);
    expect(items.every((item) => item.status === "published")).toBe(true);
    const orders = items.map((item) => item.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(items[0].title).toBe("Something new");
    expect(items[1].title).toBe("Agentic workflows");
    expect(items[2].label).toBe("Shipping");
    expect(items[3].label).toBe("Reading");
  });
});
