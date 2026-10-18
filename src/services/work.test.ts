import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { workRepository } from "@/lib/firebase";
import type { WorkItem } from "@/lib/schemas/work";
import { workSeed } from "@/lib/seed/work";
import { getWork, getWorkBySlug, publishedWorkItems } from "./work";

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

describe("getWork", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(workRepository.listPublished).mockReset();
    vi.mocked(workRepository.getBySlug).mockReset();
  });

  it("returns published work seed sorted by order", async () => {
    const items = await getWork();
    expect(items).toHaveLength(6);
    expect(items.every((item) => item.status === "published")).toBe(true);
    expect(items.map((item) => item.order)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(items.map((item) => item.title)).toEqual([
      "Trinnect",
      "Terranzo",
      "iSense My Float",
      "Fastbrix",
      "Vigil",
      "Open finance project",
    ]);
    expect(items.some((item) => item.category === "fintech")).toBe(true);
    expect(workRepository.listPublished).not.toHaveBeenCalled();
  });

  it("returns repository items when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(workRepository.listPublished).mockResolvedValue([
      { ...workSeed[0], title: "From Firestore" },
    ]);

    const items = await getWork();
    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("From Firestore");
  });

  it("falls back to seed when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(workRepository.listPublished).mockRejectedValue(
      new Error("offline"),
    );

    const items = await getWork();
    expect(items).toHaveLength(6);
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
});
