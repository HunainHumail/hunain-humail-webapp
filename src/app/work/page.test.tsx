import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/lib/env";
import { workSeed } from "@/lib/seed/work";
import WorkIndexPage, { generateMetadata } from "./page";

async function revealAllProjects(): Promise<void> {
  const user = userEvent.setup();
  while (screen.queryByRole("button", { name: "Load more" })) {
    await user.click(screen.getByRole("button", { name: "Load more" }));
  }
}

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

describe("WorkIndexPage", () => {
  it("renders every published project", async () => {
    const ui = await WorkIndexPage();
    render(ui);

    expect(
      screen.getByRole("heading", { level: 1, name: "All projects" }),
    ).toBeInTheDocument();
    await revealAllProjects();
    const list = screen.getByRole("list", { name: "Case studies" });
    expect(within(list).getAllByRole("heading", { level: 3 })).toHaveLength(
      workSeed.length,
    );
    for (const item of workSeed) {
      expect(
        within(list).getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
      expect(
        within(list).getByRole("link", { name: new RegExp(item.title) }),
      ).toHaveAttribute("href", `/work/${item.slug}`);
    }
  });

  it("generateMetadata canonicalizes /work", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("All projects · Hunain Humail");
    expect(metadata.alternates).toEqual({ canonical: `${getSiteUrl()}/work` });
  });
});
