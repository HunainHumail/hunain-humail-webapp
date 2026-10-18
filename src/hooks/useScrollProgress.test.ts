import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useScrollProgress } from "./useScrollProgress";

describe("useScrollProgress", () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    window.scrollY = 0;
  });

  it("returns 0 at top and increases on scroll", () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);

    act(() => {
      window.scrollY = 500;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(0.5);
  });
});
