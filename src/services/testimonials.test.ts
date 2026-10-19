import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { testimonialsRepository } from "@/lib/firebase";
import type { Testimonial } from "@/lib/schemas/testimonial";
import { getTestimonials, publishedTestimonials } from "./testimonials";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  testimonialsRepository: {
    listPublished: vi.fn(),
  },
}));

const baseItem: Testimonial = {
  id: "test",
  name: "Ada Lovelace",
  role: "Engineering lead, Analytical Engines",
  source: "linkedin",
  text: "Clear thinking on agentic workflows.",
  date: "2026-03-01",
  order: 0,
  status: "published",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("publishedTestimonials", () => {
  it("filters drafts and sorts by order", () => {
    const items: Testimonial[] = [
      { ...baseItem, id: "b", order: 2, status: "published" },
      { ...baseItem, id: "c", order: 1, status: "draft" },
      { ...baseItem, id: "a", order: 0, status: "published" },
    ];

    expect(publishedTestimonials(items).map((item) => item.id)).toEqual([
      "a",
      "b",
    ]);
  });
});

describe("getTestimonials", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(testimonialsRepository.listPublished).mockReset();
  });

  it("returns an empty list when seed is empty and Firebase is off", async () => {
    await expect(getTestimonials()).resolves.toEqual([]);
    expect(testimonialsRepository.listPublished).not.toHaveBeenCalled();
  });

  it("returns repository items when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(testimonialsRepository.listPublished).mockResolvedValue([
      { ...baseItem, id: "live", order: 1 },
      { ...baseItem, id: "first", order: 0 },
    ]);

    const items = await getTestimonials();
    expect(items.map((item) => item.id)).toEqual(["first", "live"]);
  });

  it("returns an empty list when the published collection is empty", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(testimonialsRepository.listPublished).mockResolvedValue([]);

    await expect(getTestimonials()).resolves.toEqual([]);
  });

  it("returns an empty list when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(testimonialsRepository.listPublished).mockRejectedValue(
      new Error("offline"),
    );

    await expect(getTestimonials()).resolves.toEqual([]);
  });
});
