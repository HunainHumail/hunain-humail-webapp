import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BlueprintError } from "@/lib/blueprint/errors";

const { reportClientError, ensureAppCheckToken, getBlueprintCallable, envFlags } = vi.hoisted(
  () => ({
    reportClientError: vi.fn(),
    ensureAppCheckToken: vi.fn(),
    getBlueprintCallable: vi.fn(),
    envFlags: { mock: false, configured: true },
  }),
);

vi.mock("@/lib/health/reportClientError", () => ({
  reportClientError: (...args: unknown[]) => reportClientError(...args),
}));

vi.mock("@/lib/firebase/functions", () => ({
  ensureAppCheckToken: (...args: unknown[]) => ensureAppCheckToken(...args),
  getBlueprintCallable: (...args: unknown[]) => getBlueprintCallable(...args),
}));

vi.mock("@/lib/env", async () => {
  const actual = await vi.importActual<typeof import("@/lib/env")>("@/lib/env");
  return {
    ...actual,
    isBlueprintMockEnabled: () => envFlags.mock,
    isFirebaseConfigured: () => envFlags.configured,
  };
});

import { generateBlueprint } from "./blueprint";

const input = {
  email: "ada@example.com",
  idea: "A booking app for neighbourhood services with reminders.",
  platform: "mobile" as const,
};

describe("generateBlueprint timeouts", () => {
  beforeEach(() => {
    vi.useRealTimers();
    reportClientError.mockClear();
    ensureAppCheckToken.mockReset();
    getBlueprintCallable.mockReset();
    envFlags.mock = false;
    envFlags.configured = true;
    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fails with timeout when App Check has not returned after 60s", async () => {
    vi.useFakeTimers();
    ensureAppCheckToken.mockImplementation(() => new Promise(() => undefined));
    getBlueprintCallable.mockResolvedValue(vi.fn());

    const pending = generateBlueprint(input);
    const settled = pending.then(
      () => null,
      (error: unknown) => error,
    );
    await vi.advanceTimersByTimeAsync(59_000);
    expect(reportClientError).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1_000);

    const error = await settled;
    expect(error).toBeInstanceOf(BlueprintError);
    expect(error).toMatchObject({ kind: "timeout" });
    expect(reportClientError).toHaveBeenCalledTimes(1);
    expect(reportClientError).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "timeout",
        redact: [input.email, input.idea],
      }),
    );
  });

  it("fails with timeout when the callable exceeds 25s", async () => {
    vi.useFakeTimers();
    ensureAppCheckToken.mockResolvedValue(undefined);
    getBlueprintCallable.mockResolvedValue(vi.fn(() => new Promise(() => undefined)));

    const pending = generateBlueprint(input);
    const settled = pending.then(
      () => null,
      (error: unknown) => error,
    );
    await vi.advanceTimersByTimeAsync(25_000);

    const error = await settled;
    expect(error).toBeInstanceOf(BlueprintError);
    expect(error).toMatchObject({ kind: "timeout" });
    expect(reportClientError).toHaveBeenCalledWith(
      expect.objectContaining({ type: "timeout" }),
    );
  });

  it("reports app-check with the raw code", async () => {
    ensureAppCheckToken.mockRejectedValue(
      Object.assign(new Error("no token"), { code: "appCheck/fetch-status-error" }),
    );
    getBlueprintCallable.mockResolvedValue(vi.fn());

    await expect(generateBlueprint(input)).rejects.toMatchObject({ kind: "app-check" });
    expect(reportClientError).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "app-check",
        code: "appCheck/fetch-status-error",
      }),
    );
  });
});
