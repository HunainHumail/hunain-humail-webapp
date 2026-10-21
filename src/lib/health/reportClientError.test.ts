import { beforeEach, describe, expect, it, vi } from "vitest";
import { HEALTH_FIELD_LIMITS } from "./limits";

const { addDoc, collection, serverTimestamp, getFirebaseDb, isBlueprintMockEnabled } =
  vi.hoisted(() => ({
    addDoc: vi.fn<(...args: unknown[]) => Promise<{ id: string }>>(() =>
      Promise.resolve({ id: "event-1" }),
    ),
    collection: vi.fn<(...args: unknown[]) => { name: string }>(() => ({
      name: "healthEvents",
    })),
    serverTimestamp: vi.fn(() => ({ marker: "server" })),
    getFirebaseDb: vi.fn((): { id: string } | null => ({ id: "db" })),
    isBlueprintMockEnabled: vi.fn(() => false),
  }));

vi.mock("firebase/firestore", () => ({
  addDoc: (...args: unknown[]) => addDoc(...args),
  collection: (...args: unknown[]) => collection(...args),
  serverTimestamp: () => serverTimestamp(),
}));

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseDb: () => getFirebaseDb(),
}));

vi.mock("@/lib/env", () => ({
  isBlueprintMockEnabled: () => isBlueprintMockEnabled(),
}));

async function loadReporter() {
  return import("./reportClientError");
}

describe("reportClientError", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.resetModules();
    addDoc.mockClear();
    addDoc.mockImplementation(() => Promise.resolve({ id: "event-1" }));
    collection.mockClear();
    serverTimestamp.mockClear();
    getFirebaseDb.mockReset();
    getFirebaseDb.mockReturnValue({ id: "db" });
    isBlueprintMockEnabled.mockReset();
    isBlueprintMockEnabled.mockReturnValue(false);
    sessionStorage.clear();
    window.history.pushState({}, "", "/blueprint");
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: "TestAgent/1.0",
    });
  });

  it("writes the client health shape and strips secrets", async () => {
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: "U".repeat(200),
    });
    window.history.pushState({}, "", `/${"p".repeat(250)}`);
    const { reportClientError } = await loadReporter();
    const idea = "A booking app for neighbourhood services with reminders.";

    reportClientError({
      type: "unknown",
      code: `functions/${"c".repeat(100)}`,
      message: `failed ada@example.com token=abc123 while building ${idea} ${"m".repeat(400)}`,
      redact: ["ada@example.com", idea],
    });

    expect(addDoc).toHaveBeenCalledTimes(1);
    const payload = addDoc.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(Object.keys(payload).sort()).toEqual(
      ["code", "createdAt", "message", "page", "sessionId", "source", "type", "ua"].sort(),
    );
    expect(payload.source).toBe("client");
    expect(payload.type).toBe("unknown");
    expect(payload.createdAt).toEqual({ marker: "server" });
    expect(String(payload.code).length).toBeLessThanOrEqual(HEALTH_FIELD_LIMITS.code);
    expect(String(payload.message).length).toBeLessThanOrEqual(HEALTH_FIELD_LIMITS.message);
    expect(String(payload.page).length).toBeLessThanOrEqual(HEALTH_FIELD_LIMITS.page);
    expect(String(payload.page).length).toBe(HEALTH_FIELD_LIMITS.page);
    expect(String(payload.ua).length).toBe(HEALTH_FIELD_LIMITS.ua);
    expect(String(payload.sessionId).length).toBeGreaterThan(0);
    expect(String(payload.sessionId).length).toBeLessThanOrEqual(
      HEALTH_FIELD_LIMITS.sessionId,
    );
    expect(payload.message).not.toContain("ada@example.com");
    expect(payload.message).not.toContain("booking app");
    expect(payload.message).not.toContain("abc123");
    expect(collection).toHaveBeenCalledWith({ id: "db" }, "healthEvents");
    expect(serverTimestamp).toHaveBeenCalledOnce();

    reportClientError({ type: "offline", message: "offline" });
    const second = addDoc.mock.calls[1]?.[1] as { sessionId: string };
    expect(second.sessionId).toBe(payload.sessionId);
  });

  it("allows one report per type per 60s and five per session", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-21T00:00:00.000Z"));
    const { reportClientError } = await loadReporter();

    reportClientError({ type: "timeout", message: "timeout" });
    reportClientError({ type: "timeout", message: "timeout" });
    expect(addDoc).toHaveBeenCalledTimes(1);

    vi.setSystemTime(new Date("2026-10-21T00:00:59.999Z"));
    reportClientError({ type: "timeout", message: "timeout" });
    expect(addDoc).toHaveBeenCalledTimes(1);

    vi.setSystemTime(new Date("2026-10-21T00:01:00.000Z"));
    reportClientError({ type: "timeout", message: "timeout" });
    expect(addDoc).toHaveBeenCalledTimes(2);

    for (const type of ["a", "b", "c", "d"]) {
      reportClientError({ type, message: type });
    }
    expect(addDoc).toHaveBeenCalledTimes(5);
    reportClientError({ type: "e", message: "e" });
    vi.setSystemTime(new Date("2026-10-21T00:03:00.000Z"));
    reportClientError({ type: "f", message: "f" });
    expect(addDoc).toHaveBeenCalledTimes(5);
  });

  it("never throws and skips mock mode", async () => {
    const { reportClientError } = await loadReporter();

    addDoc.mockImplementation(() => {
      throw new Error("sync");
    });
    expect(() => reportClientError({ type: "offline", message: "offline" })).not.toThrow();

    addDoc.mockImplementation(() => Promise.reject(new Error("async")));
    expect(() => reportClientError({ type: "app-check", message: "app-check" })).not.toThrow();
    await Promise.resolve();

    getFirebaseDb.mockImplementation(() => {
      throw new Error("db");
    });
    expect(() => reportClientError({ type: "unknown", message: "unknown" })).not.toThrow();

    getFirebaseDb.mockReturnValue(null);
    addDoc.mockClear();
    expect(() => reportClientError({ type: "rate-limit", message: "rate-limit" })).not.toThrow();
    expect(addDoc).not.toHaveBeenCalled();

    isBlueprintMockEnabled.mockReturnValue(true);
    getFirebaseDb.mockReturnValue({ id: "db" });
    reportClientError({ type: "timeout", message: "timeout" });
    expect(addDoc).not.toHaveBeenCalled();
  });
});
