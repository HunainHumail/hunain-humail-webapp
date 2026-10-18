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
});
