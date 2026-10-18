import { describe, expect, it } from "vitest";
import type { WorkItem } from "@/lib/schemas/work";
import { workSeed } from "@/lib/seed/work";
import { filterWorkByCategory } from "./filterWorkByCategory";

const baseItem: WorkItem = {
  id: "a",
  slug: "a",
  title: "A",
  category: "products",
  summary: "Summary",
  role: "GenAI engineer",
  stack: ["TypeScript"],
  highlights: ["One"],
  body: "Body",
  order: 2,
  status: "published",
  featured: false,
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("filterWorkByCategory", () => {
  it("returns all items sorted by order when category is all", () => {
    const items: WorkItem[] = [
      { ...baseItem, id: "b", slug: "b", order: 1, category: "fintech" },
      { ...baseItem, id: "c", slug: "c", order: 0, category: "ai-systems" },
    ];

    expect(filterWorkByCategory(items, "all").map((item) => item.id)).toEqual([
      "c",
      "b",
    ]);
  });

  it("filters to a single category and keeps order", () => {
    const result = filterWorkByCategory(workSeed, "fintech");
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Open finance project");
  });

  it("returns an empty list when nothing matches", () => {
    const items: WorkItem[] = [
      { ...baseItem, category: "products" },
    ];
    expect(filterWorkByCategory(items, "client-apps")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const items: WorkItem[] = [
      { ...baseItem, id: "z", order: 5 },
      { ...baseItem, id: "y", order: 1 },
    ];
    const snapshot = items.map((item) => item.id);
    filterWorkByCategory(items, "all");
    expect(items.map((item) => item.id)).toEqual(snapshot);
  });
});
