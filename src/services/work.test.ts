import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { workRepository } from "@/lib/firebase";
import type { WorkItem } from "@/lib/schemas/work";
import { workSeed } from "@/lib/seed/work";
import {
  getWork,
  getWorkBySlug,
  mergePublishedWork,
  publishedWorkItems,
} from "./work";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  workRepository: {
    listPublished: vi.fn(),
    getBySlug: vi.fn(),
  },
}));

const baseItem: WorkItem = {
  id: "test",
  slug: "test",
  title: "Test",
  category: "products",
  summary: "Summary",
  role: "GenAI engineer",
  stack: ["TypeScript"],
  highlights: ["One"],
  body: "Body",
  gallery: [],
  links: [],
  order: 0,
  status: "published",
  featured: false,
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("publishedWorkItems", () => {
  it("filters drafts and sorts by order", () => {
    const items: WorkItem[] = [
      { ...baseItem, id: "b", slug: "b", order: 2, status: "published" },
      { ...baseItem, id: "c", slug: "c", order: 1, status: "draft" },
      { ...baseItem, id: "a", slug: "a", order: 0, status: "published" },
    ];

    expect(publishedWorkItems(items).map((item) => item.id)).toEqual(["a", "b"]);
  });
});

describe("mergePublishedWork", () => {
  it("keeps seeded projects when the live list is partial", () => {
    const merged = mergePublishedWork(
      [{ ...workSeed[0], title: "From Firestore" }],
      publishedWorkItems(workSeed),
    );

    expect(merged).toHaveLength(workSeed.length);
    expect(merged.find((item) => item.slug === "trinnect")?.title).toBe(
      "From Firestore",
    );
    expect(merged.map((item) => item.slug)).toEqual(
      workSeed.map((item) => item.slug),
    );
  });
});

describe("getWork", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(workRepository.listPublished).mockReset();
    vi.mocked(workRepository.getBySlug).mockReset();
  });

  it("returns published work seed sorted by order", async () => {
    const items = await getWork();
    expect(items).toHaveLength(workSeed.length);
    expect(items.every((item) => item.status === "published")).toBe(true);
    expect(items.map((item) => item.order)).toEqual(
      workSeed.map((item) => item.order),
    );
    expect(items.slice(0, 5).map((item) => item.title)).toEqual([
      "Trinnect",
      "Terranzo",
      "My Float by I-Sense",
      "Fast Brix",
      "Vigil",
    ]);
    expect(items.slice(0, 5).every((item) => item.featured)).toBe(true);
    expect(
      items.every(
        (item) =>
          item.category === "ai-systems" ||
          item.category === "products" ||
          item.category === "client-apps",
      ),
    ).toBe(true);
    expect(workRepository.listPublished).not.toHaveBeenCalled();
  });

  it("keeps every seeded project when Firebase returns a partial list", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(workRepository.listPublished).mockResolvedValue([
      { ...workSeed[0], title: "From Firestore" },
    ]);

    const items = await getWork();
    expect(items).toHaveLength(workSeed.length);
    expect(items.find((item) => item.slug === "trinnect")?.title).toBe(
      "From Firestore",
    );
    expect(items.some((item) => item.slug === "tecobi")).toBe(true);
  });

  it("falls back to seed when the published collection is empty", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(workRepository.listPublished).mockResolvedValue([]);

    const items = await getWork();
    expect(items).toHaveLength(workSeed.length);
  });

  it("falls back to seed when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(workRepository.listPublished).mockRejectedValue(
      new Error("offline"),
    );

    const items = await getWork();
    expect(items).toHaveLength(workSeed.length);
  });
});

describe("getWorkBySlug", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(workRepository.listPublished).mockReset();
    vi.mocked(workRepository.getBySlug).mockReset();
  });

  it("returns a published case study by slug", async () => {
    const item = await getWorkBySlug("trinnect");
    expect(item?.title).toBe("Trinnect");
    expect(item?.slug).toBe("trinnect");
  });

  it("returns null when the slug is missing", async () => {
    await expect(getWorkBySlug("missing")).resolves.toBeNull();
  });

  it("uses the repository when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(workRepository.getBySlug).mockResolvedValue({
      ...workSeed[0],
      title: "From Firestore",
    });

    const item = await getWorkBySlug("trinnect");
    expect(item?.title).toBe("From Firestore");
    expect(workRepository.getBySlug).toHaveBeenCalledWith("trinnect");
  });

  it("falls back to seed when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(workRepository.getBySlug).mockRejectedValue(new Error("offline"));

    const item = await getWorkBySlug("trinnect");
    expect(item?.title).toBe("Trinnect");
  });

  it("falls back to seed when the repository has no document", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(workRepository.getBySlug).mockResolvedValue(null);

    const item = await getWorkBySlug("trinnect");
    expect(item?.title).toBe("Trinnect");
  });
});
