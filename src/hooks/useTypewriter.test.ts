import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTypewriter } from "./useTypewriter";

const lines = [
  { command: "whoami", output: "hunain — genai engineer" },
  { command: "status", output: "shipping genai" },
];

describe("useTypewriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("types commands character by character", () => {
    const { result } = renderHook(() => useTypewriter(lines));

    expect(result.current.view.command).toBe("$ ");
    act(() => {
      vi.advanceTimersByTime(80);
    });
    expect(result.current.view.command).toBe("$ w");
  });

  it("shows all lines instantly when reduced motion is on", () => {
    const { result } = renderHook(() =>
      useTypewriter(lines, { reducedMotion: true }),
    );

    expect(result.current.instantDisplay).toContain("$ whoami");
    expect(result.current.instantDisplay).toContain("$ status");
    expect(result.current.fullText).toContain("shipping genai");
  });
});
