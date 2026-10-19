import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { profileSeed } from "@/lib/seed/profile";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { HomeTemplate } from "./HomeTemplate";

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
    context: (fn: () => void) => {
      fn();
      return { revert: vi.fn() };
    },
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
  },
}));

describe("HomeTemplate", () => {
  it("renders hero inside site shell", () => {
    render(
      <HomeTemplate
        settings={siteSettingsSeed}
        profile={profileSeed}
        story={[]}
        now={[]}
        work={[]}
        writing={[]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: /Hunain\s+Humail/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "What clients say." }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Testimonials/i }),
    ).not.toBeInTheDocument();
  });

  it("shows testimonials and a nav item only when items exist", () => {
    render(
      <HomeTemplate
        settings={siteSettingsSeed}
        profile={profileSeed}
        story={[]}
        now={[]}
        work={[]}
        writing={[]}
        testimonials={[
          {
            id: "t1",
            name: "Ada Lovelace",
            role: "Engineering lead",
            source: "linkedin",
            text: "Clear thinking on agentic workflows.",
            date: "2026-03-01",
            order: 0,
            status: "published",
            updatedAt: "2026-10-18T00:00:00.000Z",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "What clients say." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /05\s*Testimonials/i })).toHaveAttribute(
      "href",
      "/#testimonials",
    );
    expect(screen.getByRole("link", { name: /06\s*Contact/i })).toBeInTheDocument();
  });
});
