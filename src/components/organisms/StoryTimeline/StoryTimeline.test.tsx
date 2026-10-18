import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { storySeed } from "@/lib/seed/story";
import { StoryTimeline } from "./StoryTimeline";

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: vi.fn() },
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    context: (fn: () => void) => {
      fn();
      return { revert: vi.fn() };
    },
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
  },
}));

describe("StoryTimeline", () => {
  it("renders story section with timeline items", () => {
    render(<StoryTimeline items={storySeed} />);

    expect(screen.getByRole("heading", { level: 2, name: "Story" })).toBeInTheDocument();
    expect(screen.getAllByText("01").length).toBeGreaterThan(0);
    const section = document.getElementById("story");
    expect(section).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Building with AI" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBe(
      storySeed.length,
    );
  });
});
