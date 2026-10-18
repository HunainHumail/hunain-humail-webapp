import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useScrollReveal } from "./useScrollReveal";

const fromTo = vi.fn();
const registerPlugin = vi.fn();
const revert = vi.fn();

vi.mock("gsap", () => ({
  default: {
    registerPlugin,
    context: (fn: () => void) => {
      fn();
      return { revert };
    },
    fromTo,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: vi.fn() },
}));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("useScrollReveal", () => {
  it("animates reveal items when present", async () => {
    const root = document.createElement("div");
    const item = document.createElement("div");
    item.setAttribute("data-reveal", "");
    root.appendChild(item);
    const rootRef = { current: root };

    renderHook(() => useScrollReveal(rootRef));
    await vi.waitFor(() => expect(fromTo).toHaveBeenCalled());
    expect(registerPlugin).toHaveBeenCalled();
  });
});
