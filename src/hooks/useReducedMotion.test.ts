import { renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "./useReducedMotion";

function mockMatchMedia(initial: boolean) {
  const listeners = new Set<() => void>();
  let matches = initial;
  const media = {
    get matches() {
      return matches;
    },
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    setMatches: (next: boolean) => {
      matches = next;
      listeners.forEach((cb) => cb());
    },
  };
  vi.stubGlobal("matchMedia", () => media);
  return media;
}

describe("useReducedMotion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reflects prefers-reduced-motion", async () => {
    const media = mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    await waitFor(() => expect(result.current).toBe(true));

    act(() => {
      media.setMatches(false);
    });

    await waitFor(() => expect(result.current).toBe(false));
  });
});
