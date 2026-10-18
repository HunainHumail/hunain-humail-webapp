import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("lenis", () => ({
  default: class MockLenis {
    on() {
      return undefined;
    }
    raf() {
      return undefined;
    }
    destroy() {
      return undefined;
    }
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: vi.fn() },
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
  },
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

describe("Home", () => {
  it("renders the hero inside site shell", async () => {
    const ui = await Home();
    render(ui);
    expect(
      screen.getByRole("heading", { level: 1, name: /Hunain\s+Humail/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View work" })).toBeInTheDocument();
  });
});
