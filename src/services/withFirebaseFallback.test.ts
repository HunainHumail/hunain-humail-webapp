import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { listOrSeed, withFirebaseFallback } from "./withFirebaseFallback";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

describe("listOrSeed", () => {
  it("uses seed when the loaded collection is empty", () => {
    expect(listOrSeed([], ["seed"])).toEqual(["seed"]);
  });

  it("keeps a non-empty collection", () => {
    expect(listOrSeed(["live"], ["seed"])).toEqual(["live"]);
  });
});

describe("withFirebaseFallback", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
  });

  it("uses the fallback when Firebase is not configured", async () => {
    const load = vi.fn(async () => "firebase");
    const value = await withFirebaseFallback(load, () => "seed");
    expect(value).toBe("seed");
    expect(load).not.toHaveBeenCalled();
  });

  it("uses the loader when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    const value = await withFirebaseFallback(
      async () => "firebase",
      () => "seed",
    );
    expect(value).toBe("firebase");
  });

  it("falls back when the loader throws", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    const value = await withFirebaseFallback(
      async () => {
        throw new Error("offline");
      },
      () => "seed",
    );
    expect(value).toBe("seed");
  });
});
