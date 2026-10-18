import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { writingRepository } from "@/lib/firebase";
import type { WritingItem } from "@/lib/schemas/writing";
import { writingSeed } from "@/lib/seed/writing";
import { LINKEDIN_PROFILE_URL } from "@/lib/utils/rewriteLinkedInUrls";
import { getWriting, publishedWritingItems } from "./writing";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  writingRepository: {
    listPublished: vi.fn(),
  },
}));

const baseItem: WritingItem = {
  id: "test",
  type: "post",
  title: "Test",
  venue: "LinkedIn",
  date: "2026-01-01",
  summary: "Summary",
  order: 0,
  status: "published",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("publishedWritingItems", () => {
  it("filters drafts and sorts by order", () => {
    const items: WritingItem[] = [
      { ...baseItem, id: "b", order: 2, status: "published" },
      { ...baseItem, id: "c", order: 1, status: "draft" },
      { ...baseItem, id: "a", order: 0, status: "published" },
    ];

    expect(publishedWritingItems(items).map((item) => item.id)).toEqual([
      "a",
      "b",
    ]);
  });
});

describe("getWriting", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(writingRepository.listPublished).mockReset();
  });

  it("returns published writing seed sorted by order", async () => {
    const items = await getWriting();
    expect(items).toHaveLength(5);
    expect(items.every((item) => item.status === "published")).toBe(true);
    expect(items.map((item) => item.order)).toEqual([0, 1, 2, 3, 4]);
    expect(items.map((item) => item.title)).toEqual([
      "Speaker",
      "Winner",
      "AI-native delivery",
      "Agentic SDLC",
      "Production evals for agents",
    ]);
    expect(items.map((item) => item.type)).toEqual([
      "talk",
      "award",
      "post",
      "post",
      "post",
    ]);
    expect(items[0]?.venue).toBe("GDG DevFest Sindh 2023");
    expect(items[1]?.venue).toBe("Google Hackathon 2020");
    expect(writingRepository.listPublished).not.toHaveBeenCalled();
  });

  it("returns repository items when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(writingRepository.listPublished).mockResolvedValue([
      { ...writingSeed[0], title: "From Firestore" },
    ]);

    const items = await getWriting();
    expect(items[0]?.title).toBe("From Firestore");
  });

  it("rewrites a stale linkedin url from Firestore", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(writingRepository.listPublished).mockResolvedValue([
      {
        ...writingSeed[2],
        url: "https://www.linkedin.com/in/hunainhumail",
      },
    ]);

    const items = await getWriting();
    expect(items[0]?.url).toBe(LINKEDIN_PROFILE_URL);
    expect(items[0]?.venue).toBe("LinkedIn");
  });

  it("falls back to seed when the published collection is empty", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(writingRepository.listPublished).mockResolvedValue([]);

    const items = await getWriting();
    expect(items).toHaveLength(5);
  });

  it("falls back to seed when the repository throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(writingRepository.listPublished).mockRejectedValue(
      new Error("offline"),
    );

    const items = await getWriting();
    expect(items).toHaveLength(5);
  });
});
