import { describe, it, expect, vi, beforeEach } from "vitest";

const initializeAppCheck = vi.fn(() => ({ id: "appcheck" }));
const getToken = vi.fn();
vi.mock("firebase/app-check", () => ({
  initializeAppCheck,
  getToken,
  ReCaptchaEnterpriseProvider: vi.fn(function (this: { key: string }, key: string) {
    this.key = key;
  }),
}));
const httpsCallable = vi.fn(() => vi.fn());
const getFunctions = vi.fn(() => ({}));
vi.mock("firebase/functions", () => ({
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator: vi.fn(),
}));
vi.mock("./client", () => ({ getFirebaseApp: () => ({ name: "app" }) }));
vi.mock("@/lib/env", () => ({
  getAppCheckSiteKey: () => "6LfN7PgtAAAAAH_WsfTyi2k-sBOMBmMFz9vBmuvn",
  getFunctionsRegion: () => "me-central1",
  isFirebaseEmulatorEnabled: () => false,
}));

async function load() {
  vi.resetModules();
  delete (globalThis as Record<string, unknown>).__hhAppCheckInitialized;
  return import("./functions");
}

describe("App Check wiring", () => {
  beforeEach(() => {
    initializeAppCheck.mockClear();
    getToken.mockReset();
    getFunctions.mockClear();
  });

  it("initializes App Check with reCAPTCHA Enterprise before creating the callable", async () => {
    const mod = await load();
    await mod.getBlueprintCallable();
    expect(initializeAppCheck).toHaveBeenCalledTimes(1);
    const opts = (initializeAppCheck.mock.calls[0] as unknown[])[1] as {
      provider: { key: string };
      isTokenAutoRefreshEnabled: boolean;
    };
    expect(opts.provider.key).toBe("6LfN7PgtAAAAAH_WsfTyi2k-sBOMBmMFz9vBmuvn");
    expect(opts.isTokenAutoRefreshEnabled).toBe(true);
    expect(initializeAppCheck.mock.invocationCallOrder[0]).toBeLessThan(
      getFunctions.mock.invocationCallOrder[0],
    );
  });

  it("obtains a token before the call", async () => {
    const mod = await load();
    getToken.mockResolvedValueOnce({ token: "t" });
    await expect(mod.ensureAppCheckToken()).resolves.toBeUndefined();
    expect(getToken).toHaveBeenCalledWith({ id: "appcheck" }, false);
  });

  it("retries once with force refresh, then fails with AppCheckTokenError", async () => {
    const mod = await load();
    getToken.mockRejectedValue(Object.assign(new Error("x"), { code: "appCheck/fetch-status-error" }));
    await expect(mod.ensureAppCheckToken()).rejects.toBeInstanceOf(mod.AppCheckTokenError);
    expect(getToken).toHaveBeenCalledTimes(2);
    expect(getToken.mock.calls[1][1]).toBe(true);
  });

  it("does not hammer reCAPTCHA when throttled", async () => {
    const mod = await load();
    getToken.mockRejectedValue(Object.assign(new Error("x"), { code: "appCheck/throttled" }));
    await expect(mod.ensureAppCheckToken()).rejects.toMatchObject({ code: "appCheck/throttled" });
    expect(getToken).toHaveBeenCalledTimes(1);
  });
});
