import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { workSeed } from "@/lib/seed/work";
import { workFilterTabs } from "@/lib/utils/filterWorkByCategory";
import { WorkIndexTemplate } from "./WorkIndexTemplate";

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

describe("WorkIndexTemplate", () => {
  it("renders every project under an All projects heading", () => {
    render(<WorkIndexTemplate settings={siteSettingsSeed} items={workSeed} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "All projects",
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const list = screen.getByRole("list", { name: "Case studies" });
    expect(within(list).getAllByRole("heading", { level: 3 })).toHaveLength(
      workSeed.length,
    );
    for (const item of workSeed) {
      expect(
        within(list).getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
    }
    const allTab = workFilterTabs(workSeed).find((tab) => tab.value === "all");
    expect(screen.getByRole("button", { name: allTab?.label })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.queryByRole("link", { name: /View all projects/i }),
    ).not.toBeInTheDocument();
  });
});
