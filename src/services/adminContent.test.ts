import { beforeEach, describe, expect, it, vi } from "vitest";

const profile = {
  list: vi.fn(),
  subscribe: vi.fn(),
  upsert: vi.fn(),
  delete: vi.fn(),
  reorder: vi.fn(),
  listPublished: vi.fn(),
  getById: vi.fn(),
  getBySlug: vi.fn(),
};

vi.mock("@/lib/firebase/repositories", () => ({
  profileRepository: profile,
  settingsRepository: profile,
  storyRepository: profile,
  nowRepository: profile,
  workRepository: profile,
  writingRepository: profile,
  testimonialsRepository: profile,
}));

describe("getAdminRepository", () => {
  beforeEach(() => {
    profile.list.mockReset();
    profile.upsert.mockReset();
  });

  it("lists documents through the collection repository", async () => {
    profile.list.mockResolvedValue([
      { id: "story-1", title: "Android", status: "published", order: 0 },
    ]);
    const { getAdminRepository } = await import("./adminContent");
    const repo = getAdminRepository("story");
    await expect(repo.list()).resolves.toEqual([
      { id: "story-1", title: "Android", status: "published", order: 0 },
    ]);
  });

  it("drops documents that have no id", async () => {
    profile.list.mockResolvedValue([{ title: "Missing id" }]);
    const { getAdminRepository } = await import("./adminContent");
    await expect(getAdminRepository("story").list()).resolves.toEqual([]);
  });

  it("applies schema defaults so work editors show gallery and links", async () => {
    profile.list.mockResolvedValue([
      {
        id: "work-trinnect",
        slug: "trinnect",
        title: "Trinnect",
        category: "ai-systems",
        summary: "Summary",
        role: "GenAI engineer",
        stack: ["React"],
        highlights: ["One"],
        body: "Body",
        featured: true,
        order: 0,
        status: "published",
        updatedAt: "2026-10-18T00:00:00.000Z",
      },
    ]);
    const { getAdminRepository } = await import("./adminContent");
    const items = await getAdminRepository("work").list();
    expect(items[0]?.id).toBe("work-trinnect");
    expect(items[0]?.gallery).toEqual([]);
    expect(items[0]?.links).toEqual([]);
  });
});
