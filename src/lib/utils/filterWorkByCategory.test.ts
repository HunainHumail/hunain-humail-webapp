import { describe, expect, it } from "vitest";
import type { WorkItem } from "@/lib/schemas/work";
import { workSeed } from "@/lib/seed/work";
import {
  countWorkByCategory,
  filterWorkByCategory,
  workFilterTabs,
} from "./filterWorkByCategory";

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
  it("keeps every seeded project when the filter is all", () => {
    const result = filterWorkByCategory(workSeed, "all");
    expect(result).toHaveLength(workSeed.length);
    expect(result.map((item) => item.slug)).toEqual(
      workSeed.map((item) => item.slug),
    );
  });

  it("counts each filter tab from the full list", () => {
    expect(countWorkByCategory(workSeed)).toEqual({
      all: workSeed.length,
      "ai-systems": 5,
      products: 5,
      "client-apps": 7,
    });
    expect(workFilterTabs(workSeed).map((tab) => tab.label)).toEqual([
      `All (${workSeed.length})`,
      "AI systems (5)",
      "Products (5)",
      "Client apps (7)",
    ]);
  });

  it("returns all items sorted by order when category is all", () => {
    const items: WorkItem[] = [
      { ...baseItem, id: "b", slug: "b", order: 1, category: "client-apps" },
      { ...baseItem, id: "c", slug: "c", order: 0, category: "ai-systems" },
    ];

    expect(filterWorkByCategory(items, "all").map((item) => item.id)).toEqual([
      "c",
      "b",
    ]);
  });

  it("filters to a single category and keeps order", () => {
    const result = filterWorkByCategory(workSeed, "ai-systems");
    expect(result).toHaveLength(5);
    expect(result.map((item) => item.slug)).toEqual([
      "trinnect",
      "terranzo",
      "my-float",
      "fast-brix",
      "vigil",
    ]);
  });

  it("returns an empty list when nothing matches", () => {
    const items: WorkItem[] = [{ ...baseItem, category: "products" }];
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
