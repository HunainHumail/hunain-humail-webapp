import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { SiteTemplate } from "./SiteTemplate";

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

describe("SiteTemplate", () => {
  it("renders skip link, header, main, and footer", () => {
    render(
      <SiteTemplate settings={siteSettingsSeed}>
        <p>Page body</p>
      </SiteTemplate>,
    );
    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#content",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "content");
    expect(screen.getByText("Page body")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
