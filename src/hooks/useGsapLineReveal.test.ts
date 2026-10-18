import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useGsapLineReveal } from "./useGsapLineReveal";

const fromTo = vi.fn();
const revert = vi.fn();

vi.mock("gsap", () => ({
  default: {
    context: (fn: () => void) => {
      fn();
      return { revert };
    },
    fromTo,
  },
}));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("useGsapLineReveal", () => {
  it("animates reveal lines when present", async () => {
    const root = document.createElement("div");
    const line = document.createElement("span");
    line.setAttribute("data-reveal-line", "");
    root.appendChild(line);
    const rootRef = { current: root };

    renderHook(() => useGsapLineReveal(rootRef));
    await vi.waitFor(() => expect(fromTo).toHaveBeenCalled());
  });
});
