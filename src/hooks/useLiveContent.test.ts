import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StoryItem } from "@/lib/schemas/story";
import { storySeed } from "@/lib/seed/story";
import { LIVE_CONTENT_TIMEOUT_MS } from "@/services/liveContent";
import { fetchLivePublished } from "@/services/livePublished";
import { useLiveContent } from "./useLiveContent";

vi.mock("@/services/liveContent", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/liveContent")>();
  return {
    ...actual,
    isLiveClientFetchEnabled: () => true,
  };
});

vi.mock("@/services/livePublished", () => ({
  fetchLivePublished: vi.fn(),
}));

const published = storySeed[0];
const other = storySeed[1];

if (!published || !other) {
  throw new Error("Expected story seed");
}

function liveStory(overrides: Partial<StoryItem> = {}): StoryItem {
  return { ...published, ...overrides };
}

describe("useLiveContent", () => {
  beforeEach(() => {
    vi.mocked(fetchLivePublished).mockReset();
  });

  afterEach(async () => {
    vi.useRealTimers();
    const { resetLiveContentCache } = await import("@/services/liveContent");
    resetLiveContentCache();
  });

  it("merges published Firestore documents over seed by id", async () => {
    vi.mocked(fetchLivePublished).mockResolvedValue([
      liveStory({ title: "From CMS" }),
      {
        ...other,
        id: "story-cms-new",
        title: "New chapter",
        year: "2026",
        body: "Published after the last static export.",
        tags: ["GenAI"],
        order: 9,
        status: "published",
      },
    ]);

    const { result } = renderHook(() => useLiveContent("story", storySeed));
    expect(result.current).toEqual(storySeed);

    await waitFor(() => {
      expect(
        result.current.find((item) => item.id === published.id)?.title,
      ).toBe("From CMS");
    });

    expect(result.current.find((item) => item.id === other.id)?.title).toBe(
      other.title,
    );
    expect(result.current.find((item) => item.id === "story-cms-new")?.title).toBe(
      "New chapter",
    );
  });

  it("filters drafts so they never override seed", async () => {
    vi.mocked(fetchLivePublished).mockResolvedValue([
      liveStory({ title: "Live published" }),
      liveStory({
        id: other.id,
        title: "Hidden draft",
        status: "draft",
      }),
      {
        ...published,
        id: "story-draft-only",
        title: "Draft only",
        status: "draft",
      },
    ]);

    const { result } = renderHook(() => useLiveContent("story", storySeed));

    await waitFor(() => {
      expect(
        result.current.find((item) => item.id === published.id)?.title,
      ).toBe("Live published");
    });

    expect(result.current.every((item) => item.status === "published")).toBe(
      true,
    );
    expect(result.current.find((item) => item.id === other.id)?.title).toBe(
      other.title,
    );
    expect(
      result.current.find((item) => item.id === "story-draft-only"),
    ).toBeUndefined();
  });

  it("keeps static data when Firestore is empty", async () => {
    vi.mocked(fetchLivePublished).mockResolvedValue([]);

    const { result } = renderHook(() => useLiveContent("story", storySeed));
    await waitFor(() => {
      expect(fetchLivePublished).toHaveBeenCalledWith("story");
    });
    expect(result.current).toEqual(storySeed);
  });

  it("keeps static data when the live read fails", async () => {
    vi.mocked(fetchLivePublished).mockRejectedValue(new Error("offline"));

    const { result } = renderHook(() => useLiveContent("story", storySeed));
    await waitFor(() => {
      expect(fetchLivePublished).toHaveBeenCalled();
    });
    expect(result.current).toEqual(storySeed);
  });

  it("keeps static data when the live read times out", async () => {
    vi.useFakeTimers();
    vi.mocked(fetchLivePublished).mockImplementation(
      () => new Promise(() => undefined),
    );

    const { result } = renderHook(() => useLiveContent("story", storySeed));
    expect(result.current).toEqual(storySeed);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(LIVE_CONTENT_TIMEOUT_MS);
    });

    expect(result.current).toEqual(storySeed);
    vi.useRealTimers();
  });

  it("shares one fetch per collection for the page load", async () => {
    vi.mocked(fetchLivePublished).mockResolvedValue([
      liveStory({ title: "Shared" }),
    ]);

    const first = renderHook(() => useLiveContent("story", storySeed));
    const second = renderHook(() => useLiveContent("story", storySeed));

    await waitFor(() => {
      expect(
        first.result.current.find((item) => item.id === published.id)?.title,
      ).toBe("Shared");
      expect(
        second.result.current.find((item) => item.id === published.id)?.title,
      ).toBe("Shared");
    });

    expect(fetchLivePublished).toHaveBeenCalledTimes(1);
  });
});
