import { afterEach, describe, expect, it, vi } from "vitest";

describe("isFirebaseConfigured", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns false when Firebase env vars are missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "");
    const { isFirebaseConfigured } = await import("./env");
    expect(isFirebaseConfigured()).toBe(false);
  });

  it("returns true when all Firebase env vars are set", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "key");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "domain");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "project");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "bucket");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "sender");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "app");
    const { isFirebaseConfigured } = await import("./env");
    expect(isFirebaseConfigured()).toBe(true);
  });
});
