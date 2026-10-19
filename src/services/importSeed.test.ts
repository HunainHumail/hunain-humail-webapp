import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_EMAIL } from "@/lib/admin";
import { ADMIN_COLLECTION_NAMES } from "@/lib/admin/collections";
import { buildSeedImportPayload } from "@/lib/seed/importPayload";

const commitBatchSets = vi.hoisted(() => vi.fn());
const getFirebaseAuth = vi.hoisted(() => vi.fn());

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseAuth: () => getFirebaseAuth(),
}));

vi.mock("@/lib/firebase/batchWrite", () => ({
  commitBatchSets: (...args: unknown[]) => commitBatchSets(...args),
}));

describe("importSeedData", () => {
  beforeEach(() => {
    getFirebaseAuth.mockReset();
    commitBatchSets.mockReset();
    commitBatchSets.mockResolvedValue(undefined);
  });

  it("refuses to write when the signed-in user is not the admin", async () => {
    getFirebaseAuth.mockReturnValue({ currentUser: null });
    const { importSeedData } = await import("./importSeed");
    await expect(importSeedData()).rejects.toThrow(
      "Only the admin can import seed data",
    );
    expect(commitBatchSets).not.toHaveBeenCalled();
  });

  it("writes every seed collection in admin-editor order and returns counts", async () => {
    getFirebaseAuth.mockReturnValue({
      currentUser: { email: ADMIN_EMAIL, emailVerified: true },
    });
    const { importSeedData } = await import("./importSeed");
    const result = await importSeedData(() => "2026-10-19T12:00:00.000Z");
    const payload = buildSeedImportPayload(() => "2026-10-19T12:00:00.000Z");

    expect(result.counts).toEqual(payload.counts);
    expect(result.total).toBe(payload.documents.length);
    expect(commitBatchSets).toHaveBeenCalledTimes(ADMIN_COLLECTION_NAMES.length);

    for (const [index, name] of ADMIN_COLLECTION_NAMES.entries()) {
      const ops = commitBatchSets.mock.calls[index]?.[0] as Array<{
        collection: string;
        id: string;
      }>;
      expect(ops?.every((operation) => operation.collection === name)).toBe(true);
      expect(ops).toHaveLength(payload.counts[name]);
    }
  });

  it("surfaces the collection name when a batch fails", async () => {
    getFirebaseAuth.mockReturnValue({
      currentUser: { email: ADMIN_EMAIL, emailVerified: true },
    });
    commitBatchSets.mockRejectedValueOnce(new Error("permission-denied"));
    const { importSeedData } = await import("./importSeed");
    await expect(importSeedData()).rejects.toThrow(
      /Failed to import profile \(1 docs\): permission-denied/,
    );
  });
});
