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

describe("HomeTemplate", () => {
  it("renders hero inside site shell", () => {
    render(
      <HomeTemplate
        settings={siteSettingsSeed}
        profile={profileSeed}
        story={[]}
        now={[]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: /Hunain\s+Humail/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
  });
});
