import { describe, expect, it } from "vitest";
import type { WritingItem } from "@/lib/schemas/writing";
import { writingSeed } from "@/lib/seed/writing";
import {
  filterWritingByType,
  groupWritingByType,
} from "./filterWritingByType";

const baseItem: WritingItem = {
  id: "a",
  type: "post",
  title: "A",
  venue: "LinkedIn",
  date: "2026-01-01",
  summary: "Summary",
  order: 2,
  status: "published",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("filterWritingByType", () => {
  it("returns all items sorted by order when type is all", () => {
    const items: WritingItem[] = [
      { ...baseItem, id: "b", order: 1, type: "award" },
      { ...baseItem, id: "c", order: 0, type: "talk" },
    ];

    expect(filterWritingByType(items, "all").map((item) => item.id)).toEqual([
      "c",
      "b",
    ]);
  });

  it("filters to a single type and keeps order", () => {
    const result = filterWritingByType(writingSeed, "talk");
    expect(result).toHaveLength(1);
    expect(result[0]?.venue).toBe("GDG DevFest Sindh 2023");
  });

  it("returns an empty list when nothing matches", () => {
    const items: WritingItem[] = [{ ...baseItem, type: "post" }];
    expect(filterWritingByType(items, "talk")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const items: WritingItem[] = [
      { ...baseItem, id: "z", order: 5 },
      { ...baseItem, id: "y", order: 1 },
    ];
    const snapshot = items.map((item) => item.id);
    filterWritingByType(items, "all");
    expect(items.map((item) => item.id)).toEqual(snapshot);
  });
});

describe("groupWritingByType", () => {
  it("groups seed items in talk, award, post order", () => {
    const groups = groupWritingByType(writingSeed);
    expect(groups.map((group) => group.type)).toEqual([
      "talk",
      "award",
      "post",
    ]);
    expect(groups[0]?.label).toBe("Talks");
    expect(groups[1]?.items).toHaveLength(1);
    expect(groups[2]?.items).toHaveLength(3);
  });

  it("omits empty type groups", () => {
    const items: WritingItem[] = [{ ...baseItem, type: "post" }];
    const groups = groupWritingByType(items);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.type).toBe("post");
  });
});
