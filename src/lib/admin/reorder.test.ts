import { describe, expect, it } from "vitest";
import { reorderCollectionIds } from "./reorder";

describe("reorderCollectionIds", () => {
  it("moves the active id onto the over id", () => {
    expect(reorderCollectionIds(["a", "b", "c"], "a", "c")).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it("returns null when the drop target is missing or unchanged", () => {
    expect(reorderCollectionIds(["a", "b"], "a", "a")).toBeNull();
    expect(reorderCollectionIds(["a", "b"], "a", null)).toBeNull();
    expect(reorderCollectionIds(["a", "b"], "missing", "b")).toBeNull();
  });
});
