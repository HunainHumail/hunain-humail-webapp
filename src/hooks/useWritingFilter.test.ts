import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { writingSeed } from "@/lib/seed/writing";
import { useWritingFilter } from "./useWritingFilter";

describe("useWritingFilter", () => {
  it("starts on all and filters when the type changes", () => {
    const { result } = renderHook(() => useWritingFilter(writingSeed));

    expect(result.current.type).toBe("all");
    expect(result.current.filtered).toHaveLength(writingSeed.length);

    act(() => {
      result.current.setType("talk");
    });

    expect(result.current.type).toBe("talk");
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0]?.venue).toBe("GDG DevFest Sindh 2023");
  });
});
