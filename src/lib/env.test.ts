import { afterEach, describe, expect, it, vi } from "vitest";

function stubFirebaseEnv() {
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "key");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "domain");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "project");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "bucket");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "sender");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "app");
}

describe("firebase env", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns false when Firebase env vars are missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "");
    const { isFirebaseConfigured, getFirebaseWebConfig } =
      await import("./env");
    expect(isFirebaseConfigured()).toBe(false);
    expect(getFirebaseWebConfig()).toBeNull();
  });

  it("returns config when all Firebase env vars are set", async () => {
    stubFirebaseEnv();
    const { isFirebaseConfigured, getFirebaseWebConfig } =
      await import("./env");
    expect(isFirebaseConfigured()).toBe(true);
    expect(getFirebaseWebConfig()).toEqual({
      apiKey: "key",
      authDomain: "domain",
      projectId: "project",
      storageBucket: "bucket",
      messagingSenderId: "sender",
      appId: "app",
    });
  });

  it("enables the emulator only when the flag is the string true", async () => {
    stubFirebaseEnv();
    vi.stubEnv("NEXT_PUBLIC_USE_FIREBASE_EMULATOR", "true");
    const { isFirebaseEmulatorEnabled } = await import("./env");
    expect(isFirebaseEmulatorEnabled()).toBe(true);
  });

  it("does not enable the emulator for other values", async () => {
    stubFirebaseEnv();
    vi.stubEnv("NEXT_PUBLIC_USE_FIREBASE_EMULATOR", "1");
    const { isFirebaseEmulatorEnabled } = await import("./env");
    expect(isFirebaseEmulatorEnabled()).toBe(false);
  });
});
