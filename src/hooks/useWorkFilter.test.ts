import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { workSeed } from "@/lib/seed/work";
import { useWorkFilter } from "./useWorkFilter";

describe("useWorkFilter", () => {
  it("starts on all and filters when the category changes", () => {
    const { result } = renderHook(() => useWorkFilter(workSeed));

    expect(result.current.category).toBe("all");
    expect(result.current.filtered).toHaveLength(workSeed.length);

    act(() => {
      result.current.setCategory("fintech");
    });

    expect(result.current.category).toBe("fintech");
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0]?.title).toBe("Open finance project");
  });
});
