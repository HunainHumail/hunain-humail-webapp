import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { workSeed } from "@/lib/seed/work";
import WorkCaseStudyPage, {
  generateMetadata,
  generateStaticParams,
} from "./page";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
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

describe("WorkCaseStudyPage", () => {
  it("renders a published case study", async () => {
    const ui = await WorkCaseStudyPage({
      params: Promise.resolve({ slug: "trinnect" }),
    });
    render(ui);
    expect(
      screen.getByRole("heading", { level: 1, name: "Trinnect" }),
    ).toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      WorkCaseStudyPage({ params: Promise.resolve({ slug: "missing" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("generateStaticParams returns published slugs", async () => {
    const params = await generateStaticParams();
    expect(params.map((entry) => entry.slug)).toEqual(
      workSeed.map((item) => item.slug),
    );
  });

  it("generateMetadata uses the case study title and summary", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "trinnect" }),
    });
    expect(metadata.title).toBe("Trinnect · Hunain Humail");
    expect(metadata.description).toMatch(/location-based social app/i);
  });
});
