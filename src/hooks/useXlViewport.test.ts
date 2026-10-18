import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useXlViewport, XL_MEDIA_QUERY } from "./useXlViewport";

function mockMatchMedia(initial: boolean) {
  const listeners = new Set<() => void>();
  let matches = initial;
  const media = {
    get matches() {
      return matches;
    },
    media: XL_MEDIA_QUERY,
    addEventListener: (_event: string, cb: () => void) => {
      listeners.add(cb);
    },
    removeEventListener: (_event: string, cb: () => void) => {
      listeners.delete(cb);
    },
    setMatches: (next: boolean) => {
      matches = next;
      listeners.forEach((cb) => {
        cb();
      });
    },
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media),
  );
  return media;
}

describe("useXlViewport", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("tracks the xl media query", () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useXlViewport());
    expect(result.current).toBe(false);

    act(() => {
      media.setMatches(true);
    });
    expect(result.current).toBe(true);
  });
});
