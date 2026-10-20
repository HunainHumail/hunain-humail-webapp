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

  it("enables storage only for the explicit flag or the emulator", async () => {
    const disabled = await import("./env");
    expect(disabled.isFirebaseStorageEnabled()).toBe(false);

    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED", "true");
    const enabled = await import("./env");
    expect(enabled.isFirebaseStorageEnabled()).toBe(true);

    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED", "false");
    vi.stubEnv("NEXT_PUBLIC_USE_FIREBASE_EMULATOR", "true");
    const forcedOff = await import("./env");
    expect(forcedOff.isFirebaseStorageEnabled()).toBe(false);

    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED", "");
    vi.stubEnv("NEXT_PUBLIC_USE_FIREBASE_EMULATOR", "true");
    const emulator = await import("./env");
    expect(emulator.isFirebaseStorageEnabled()).toBe(true);
  });

  it("treats STATIC_EXPORT=true as a static export", async () => {
    vi.stubEnv("STATIC_EXPORT", "true");
    const { isStaticExport } = await import("./env");
    expect(isStaticExport()).toBe(true);
  });

  it("treats NEXT_PUBLIC_STATIC_EXPORT=true as a static export", async () => {
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "true");
    const { isStaticExport } = await import("./env");
    expect(isStaticExport()).toBe(true);
  });

  it("defaults the site url when NEXT_PUBLIC_SITE_URL is unset", async () => {
    const { DEFAULT_SITE_URL, getSiteUrl } = await import("./env");
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
  });

  it("normalizes NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://hunain.example/");
    const { getSiteUrl } = await import("./env");
    expect(getSiteUrl()).toBe("https://hunain.example");
  });

  it("enables the contact mock only for the string true", async () => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_MOCK", "true");
    const enabled = await import("./env");
    expect(enabled.isContactMockEnabled()).toBe(true);

    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_CONTACT_MOCK", "1");
    const disabled = await import("./env");
    expect(disabled.isContactMockEnabled()).toBe(false);
  });

  it("enables the signed-out preview only for the string true", async () => {
    vi.stubEnv("NEXT_PUBLIC_E2E_SIGNED_OUT", "true");
    const enabled = await import("./env");
    expect(enabled.isE2ESignedOut()).toBe(true);

    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_E2E_SIGNED_OUT", "");
    const disabled = await import("./env");
    expect(disabled.isE2ESignedOut()).toBe(false);
  });

  it("enables blueprint mock or firebase plus app check", async () => {
    vi.stubEnv("NEXT_PUBLIC_BLUEPRINT_MOCK", "true");
    const mock = await import("./env");
    expect(mock.isBlueprintEnabled()).toBe(true);

    vi.resetModules();
    stubFirebaseEnv();
    vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY", "site-key");
    const live = await import("./env");
    expect(live.isBlueprintEnabled()).toBe(true);

    vi.resetModules();
    stubFirebaseEnv();
    vi.stubEnv("NEXT_PUBLIC_BLUEPRINT_MOCK", "");
    vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY", "");
    const noAppCheck = await import("./env");
    expect(noAppCheck.isBlueprintEnabled()).toBe(false);
  });

  it("falls back when NEXT_PUBLIC_SITE_URL is not a url", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    const { DEFAULT_SITE_URL, getSiteUrl } = await import("./env");
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
  });
});
