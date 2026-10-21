import { beforeEach, describe, expect, it, vi } from "vitest";
import { HEALTH_LOOKBACK_MS, HEALTH_QUERY_LIMIT } from "@/lib/health/limits";

const { getDocs, getCountFromServer, query, where, orderBy, limit, collection, fromMillis, getFirebaseDb } =
  vi.hoisted(() => ({
    getDocs: vi.fn(),
    getCountFromServer: vi.fn(),
    query: vi.fn((...parts: unknown[]) => ({ parts })),
    where: vi.fn((field: string, op: string, value: unknown) => ({ field, op, value })),
    orderBy: vi.fn((field: string, direction: string) => ({ field, direction })),
    limit: vi.fn((count: number) => ({ count })),
    collection: vi.fn((_db: unknown, name: string) => ({ name })),
    fromMillis: vi.fn((ms: number) => ({ ms })),
    getFirebaseDb: vi.fn((): { id: string } | null => ({ id: "db" })),
  }));

vi.mock("firebase/firestore", () => ({
  collection: (...args: [unknown, string]) => collection(...args),
  query: (...args: unknown[]) => query(...args),
  where: (...args: [string, string, unknown]) => where(...args),
  orderBy: (...args: [string, string]) => orderBy(...args),
  limit: (count: number) => limit(count),
  Timestamp: { fromMillis: (ms: number) => fromMillis(ms) },
  getDocs: (...args: unknown[]) => getDocs(...args),
  getCountFromServer: (...args: unknown[]) => getCountFromServer(...args),
}));

vi.mock("../client", () => ({
  getFirebaseDb: () => getFirebaseDb(),
}));

describe("healthEventsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getFirebaseDb.mockReturnValue({ id: "db" });
  });

  it("loads the last 7 days ordered by createdAt and skips invalid docs", async () => {
    const now = Date.parse("2026-10-21T12:00:00.000Z");
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "e1",
          data: () => ({
            source: "server",
            type: "timeout",
            code: "deadline-exceeded",
            message: "Timeout",
            leadId: "lead-1",
            createdAt: { toDate: () => new Date("2026-10-21T08:00:00.000Z") },
          }),
        },
        { id: "bad", data: () => ({ source: "nope" }) },
      ],
    });
    const { healthEventsRepository } = await import("./healthEventsRepository");
    const events = await healthEventsRepository.listRecent(now);

    expect(events).toEqual([
      expect.objectContaining({
        id: "e1",
        source: "server",
        type: "timeout",
        createdAt: "2026-10-21T08:00:00.000Z",
        leadId: "lead-1",
      }),
    ]);
    expect(where).toHaveBeenCalledWith("createdAt", ">=", { ms: now - HEALTH_LOOKBACK_MS });
    expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(limit).toHaveBeenCalledWith(HEALTH_QUERY_LIMIT);
    expect(collection).toHaveBeenCalledWith({ id: "db" }, "healthEvents");
    expect(query).toHaveBeenCalled();
  });

  it("counts events since a timestamp", async () => {
    getCountFromServer.mockResolvedValue({ data: () => ({ count: 4 }) });
    const { healthEventsRepository } = await import("./healthEventsRepository");
    await expect(healthEventsRepository.countSince(1234)).resolves.toBe(4);
    expect(where).toHaveBeenCalledWith("createdAt", ">=", { ms: 1234 });
  });

  it("returns empty results when Firebase is not configured", async () => {
    getFirebaseDb.mockReturnValue(null);
    const { healthEventsRepository } = await import("./healthEventsRepository");
    await expect(healthEventsRepository.listRecent()).resolves.toEqual([]);
    await expect(healthEventsRepository.countSince(1)).resolves.toBe(0);
    expect(getDocs).not.toHaveBeenCalled();
    expect(getCountFromServer).not.toHaveBeenCalled();
  });
});
