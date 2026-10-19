import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { workSeed } from "@/lib/seed/work";
import { useWorkFilter } from "./useWorkFilter";

describe("useWorkFilter", () => {
  it("starts on all and filters when the category changes", () => {
    const { result } = renderHook(() => useWorkFilter(workSeed));

    expect(result.current.category).toBe("all");
    expect(result.current.filtered).toHaveLength(workSeed.length);
    expect(result.current.visible).toHaveLength(workSeed.length);

    act(() => {
      result.current.setCategory("ai-systems");
    });

    expect(result.current.category).toBe("ai-systems");
    expect(result.current.filtered[0]?.title).toBe("Trinnect");
    expect(
      result.current.filtered.every((item) => item.category === "ai-systems"),
    ).toBe(true);
  });

  it("pages the visible list and resets when the filter changes", () => {
    const { result } = renderHook(() => useWorkFilter(workSeed, 12));

    expect(result.current.visible).toHaveLength(12);
    expect(result.current.canLoadMore).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.visible.length).toBeGreaterThan(12);

    act(() => {
      result.current.setCategory("ai-systems");
    });

    expect(result.current.visible).toHaveLength(result.current.filtered.length);
    expect(result.current.canLoadMore).toBe(false);
  });
});
