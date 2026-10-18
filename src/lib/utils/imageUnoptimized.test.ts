import { afterEach, describe, expect, it, vi } from "vitest";

describe("imageUnoptimized", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("is false by default", async () => {
    const { imageUnoptimized } = await import("./imageUnoptimized");
    expect(imageUnoptimized()).toBe(false);
  });

  it("is true when STATIC_EXPORT is true", async () => {
    vi.stubEnv("STATIC_EXPORT", "true");
    vi.resetModules();
    const { imageUnoptimized } = await import("./imageUnoptimized");
    expect(imageUnoptimized()).toBe(true);
  });
});
