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
  gallery: [],
  links: [],
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
    const counts = countWorkByCategory(workSeed);
    expect(counts.all).toBe(workSeed.length);
    expect(counts["ai-systems"] + counts.products + counts["client-apps"]).toBe(
      workSeed.length,
    );
    expect(workFilterTabs(workSeed).map((tab) => tab.label)).toEqual([
      `All (${counts.all})`,
      `AI systems (${counts["ai-systems"]})`,
      `Products (${counts.products})`,
      `Client apps (${counts["client-apps"]})`,
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
    expect(result.map((item) => item.slug).slice(0, 5)).toEqual([
      "trinnect",
      "terranzo",
      "my-float",
      "fast-brix",
      "vigil",
    ]);
    expect(result.every((item) => item.category === "ai-systems")).toBe(true);
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
