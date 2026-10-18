import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useActiveSection } from "./useActiveSection";

describe("useActiveSection", () => {
  it("returns the intersecting section href", async () => {
    const story = document.createElement("section");
    story.id = "story";
    document.body.appendChild(story);

    const observers: IntersectionObserverCallback[] = [];
    class MockObserver {
      constructor(callback: IntersectionObserverCallback) {
        observers.push(callback);
      }
      observe() {
        return undefined;
      }
      disconnect() {
        return undefined;
      }
      unobserve() {
        return undefined;
      }
    }
    vi.stubGlobal("IntersectionObserver", MockObserver);

    const { result } = renderHook(() => useActiveSection(["#story", "#now"]));

    observers[0]?.(
      [
        {
          isIntersecting: true,
          intersectionRatio: 0.6,
          target: story,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );

    await vi.waitFor(() => expect(result.current).toBe("#story"));
    story.remove();
    vi.unstubAllGlobals();
  });

  it("returns a root-relative hash href when that is the nav target", async () => {
    const story = document.createElement("section");
    story.id = "story";
    document.body.appendChild(story);

    const observers: IntersectionObserverCallback[] = [];
    class MockObserver {
      constructor(callback: IntersectionObserverCallback) {
        observers.push(callback);
      }
      observe() {
        return undefined;
      }
      disconnect() {
        return undefined;
      }
      unobserve() {
        return undefined;
      }
    }
    vi.stubGlobal("IntersectionObserver", MockObserver);

    const { result } = renderHook(() => useActiveSection(["/#story"]));

    observers[0]?.(
      [
        {
          isIntersecting: true,
          intersectionRatio: 0.6,
          target: story,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );

    await vi.waitFor(() => expect(result.current).toBe("/#story"));
    story.remove();
    vi.unstubAllGlobals();
  });
});
