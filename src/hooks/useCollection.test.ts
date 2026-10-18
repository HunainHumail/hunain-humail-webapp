import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { storySeed } from "@/lib/seed/story";
import { toRecord } from "@/lib/admin/record";

const repo = vi.hoisted(() => ({
  list: vi.fn(),
  subscribe: vi.fn(),
  upsert: vi.fn(),
  delete: vi.fn(),
  reorder: vi.fn(),
}));

vi.mock("@/services/adminContent", () => ({
  getAdminRepository: () => repo,
}));

const story = toRecord(storySeed[0] ?? {});

describe("useCollection", () => {
  beforeEach(() => {
    repo.list.mockReset();
    repo.subscribe.mockReset();
    repo.upsert.mockReset();
    repo.delete.mockReset();
    repo.reorder.mockReset();
    repo.list.mockResolvedValue([story]);
    repo.subscribe.mockImplementation((onChange: (items: unknown[]) => void) => {
      onChange([story]);
      return () => undefined;
    });
    repo.upsert.mockResolvedValue(undefined);
    repo.delete.mockResolvedValue(undefined);
    repo.reorder.mockResolvedValue(undefined);
  });

  it("lists and subscribes through the repository", async () => {
    const { useCollection } = await import("./useCollection");
    const { result } = renderHook(() => useCollection("story"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(repo.list).toHaveBeenCalledTimes(1);
    expect(repo.subscribe).toHaveBeenCalledTimes(1);
    expect(result.current.items).toEqual([story]);
  });

  it("saves, deletes, and reorders through the repository", async () => {
    const { useCollection } = await import("./useCollection");
    const { result } = renderHook(() => useCollection("story"));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.save(String(story.id), story);
    });
    expect(repo.upsert).toHaveBeenCalledWith(story.id, expect.objectContaining({
      title: story.title,
    }));

    await act(async () => {
      await result.current.remove(String(story.id));
    });
    expect(repo.delete).toHaveBeenCalledWith(story.id);

    await act(async () => {
      await result.current.reorder(["b", "a"]);
    });
    expect(repo.reorder).toHaveBeenCalledWith(["b", "a"]);
  });

  it("rejects an invalid document before writing", async () => {
    const { useCollection } = await import("./useCollection");
    const { result } = renderHook(() => useCollection("story"));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(
      result.current.save("story-x", { title: "" }),
    ).rejects.toThrow("Document is invalid");
    expect(repo.upsert).not.toHaveBeenCalled();
  });
});
