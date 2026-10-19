import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { WorkItem } from "@/lib/schemas/work";
import { workSeed } from "@/lib/seed/work";
import WorkViewPage from "./page";

const cmsItem = vi.hoisted(
  () =>
    ({
      id: "work-cms-new",
      slug: "cms-new",
      title: "CMS New Project",
      category: "products",
      summary: "Published in the CMS after the last static export.",
      role: "GenAI engineer",
      stack: ["TypeScript"],
      highlights: ["Shipped from the CMS"],
      body: "A project that exists only in Firestore.",
      gallery: [
        {
          src: "/projects/trinnect/cover.webp",
          alt: "CMS New Project cover",
        },
      ],
      links: [],
      order: 99,
      status: "published",
      featured: false,
      updatedAt: "2026-10-19T00:00:00.000Z",
    }) satisfies WorkItem,
);

vi.mock("@/hooks/useLiveContent", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/hooks/useLiveContent")>();
  return {
    ...actual,
    useLiveContent: (collection: string, initial: unknown) => {
      if (collection === "work") {
        return [cmsItem];
      }
      return initial;
    },
  };
});

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("slug=cms-new"),
  usePathname: () => "/work/view",
}));

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

describe("WorkViewPage", () => {
  it("renders a new CMS slug from fetched work", async () => {
    const ui = await WorkViewPage();
    render(ui);

    expect(
      screen.getByRole("heading", { level: 1, name: "CMS New Project" }),
    ).toBeInTheDocument();
    expect(screen.getByText(cmsItem.summary)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "CMS New Project cover" }),
    ).toBeInTheDocument();
    expect(workSeed.some((item) => item.slug === "cms-new")).toBe(false);
  });
});
