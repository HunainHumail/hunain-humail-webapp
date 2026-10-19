import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AVATAR_FLIP_INTERVAL_MS } from "@/lib/utils/avatarFlip";
import { useAvatarFlip } from "./useAvatarFlip";

describe("useAvatarFlip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not start an interval with one image", () => {
    const spy = vi.spyOn(window, "setInterval");
    renderHook(() =>
      useAvatarFlip(1, { reducedMotion: false, paused: false }),
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not start an interval when reduced motion is on", () => {
    const spy = vi.spyOn(window, "setInterval");
    renderHook(() =>
      useAvatarFlip(2, { reducedMotion: true, paused: false }),
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it("flips on the interval when two images are present", () => {
    const { result } = renderHook(() =>
      useAvatarFlip(2, { reducedMotion: false, paused: false }),
    );
    expect(result.current.canFlip).toBe(true);
    expect(result.current.flipped).toBe(false);

    act(() => {
      vi.advanceTimersByTime(AVATAR_FLIP_INTERVAL_MS);
    });

    expect(result.current.flipped).toBe(true);
    expect(result.current.backIndex).toBe(1);
  });
});
