import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { workSeed } from "@/lib/seed/work";
import { CaseStudyTemplate } from "./CaseStudyTemplate";

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

describe("CaseStudyTemplate", () => {
  it("renders case study fields and markdown body", () => {
    const item = workSeed[0];
    if (!item) {
      throw new Error("Expected work seed");
    }

    render(
      <CaseStudyTemplate
        settings={siteSettingsSeed}
        item={{
          ...item,
          links: [{ label: "Live site", href: "https://example.com" }],
        }}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: item.title })).toBeInTheDocument();
    expect(screen.getByText(item.summary)).toBeInTheDocument();
    expect(screen.getByText(item.role)).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Stack" })).toBeInTheDocument();
    expect(screen.getByText(item.highlights[0] ?? "")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "What I built" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to work" })).toHaveAttribute(
      "href",
      "/#work",
    );
    expect(screen.getByRole("link", { name: "Live site" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });
});
