import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { nowRepository } from "@/lib/firebase";
import type { NowItem } from "@/lib/schemas/now";
import { nowSeed } from "@/lib/seed/now";
import { getNow, publishedNowItems } from "./now";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  nowRepository: {
    listPublished: vi.fn(),
  },
}));

const baseItem: NowItem = {
  id: "test",
  label: "Building",
  title: "Test",
  body: "Body",
  order: 0,
  status: "published",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("publishedNowItems", () => {
  it("filters drafts and sorts by order", () => {
    const items: NowItem[] = [
      { ...baseItem, id: "b", order: 2, status: "published" },
      { ...baseItem, id: "c", order: 1, status: "draft" },
      { ...baseItem, id: "a", order: 0, status: "published" },
    ];

    const result = publishedNowItems(items);
    expect(result.map((item) => item.id)).toEqual(["a", "b"]);
  });
});

describe("getNow", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(nowRepository.listPublished).mockReset();
  });

  it("returns published now seed sorted by order", async () => {
    const items = await getNow();
    expect(items.length).toBe(4);
    expect(items.every((item) => item.status === "published")).toBe(true);
    const orders = items.map((item) => item.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(items[0].title).toBe("Something new");
    expect(items[1].title).toBe("Agentic workflows");
    expect(items[2].label).toBe("Shipping");
    expect(items[3].label).toBe("Reading");
    expect(nowRepository.listPublished).not.toHaveBeenCalled();
  });

  it("returns repository items when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(nowRepository.listPublished).mockResolvedValue([
      { ...nowSeed[0], title: "From Firestore" },
    ]);

    const items = await getNow();
    expect(items[0]?.title).toBe("From Firestore");
  });

  it("falls back to seed when the published collection is empty", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(nowRepository.listPublished).mockResolvedValue([]);

    const items = await getNow();
    expect(items).toHaveLength(4);
  });

  it("falls back to seed when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(nowRepository.listPublished).mockRejectedValue(
      new Error("offline"),
    );

    const items = await getNow();
    expect(items).toHaveLength(4);
  });
});
