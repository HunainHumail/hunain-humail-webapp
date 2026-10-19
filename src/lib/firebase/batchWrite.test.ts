import { beforeEach, describe, expect, it, vi } from "vitest";

const getFirebaseDb = vi.hoisted(() => vi.fn());
const commit = vi.hoisted(() => vi.fn());
const set = vi.hoisted(() => vi.fn());

vi.mock("./client", () => ({
  getFirebaseDb: () => getFirebaseDb(),
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn((_db: unknown, name: string, id: string) => ({
    path: `${name}/${id}`,
  })),
  writeBatch: () => ({ set, commit }),
}));

describe("commitBatchSets", () => {
  beforeEach(() => {
    getFirebaseDb.mockReturnValue({ name: "db" });
    commit.mockReset();
    set.mockReset();
    commit.mockResolvedValue(undefined);
  });

  it("upserts with merge, strips undefined, and chunks at 450", async () => {
    const { commitBatchSets } = await import("./batchWrite");
    const { FIRESTORE_WRITE_CHUNK_SIZE } = await import("@/lib/utils/chunkItems");

    await commitBatchSets([
      {
        collection: "work",
        id: "work-grocery",
        data: { title: "Grocery App", company: undefined, order: 24 },
      },
    ]);

    expect(set).toHaveBeenCalledWith(
      { path: "work/work-grocery" },
      { title: "Grocery App", order: 24 },
      { merge: true },
    );
    expect(commit).toHaveBeenCalledTimes(1);

    set.mockClear();
    commit.mockClear();
    commit.mockResolvedValue(undefined);

    const ops = Array.from({ length: FIRESTORE_WRITE_CHUNK_SIZE + 1 }, (_, index) => ({
      collection: "work" as const,
      id: `work-${index}`,
      data: { order: index },
    }));
    await commitBatchSets(ops);
    expect(commit).toHaveBeenCalledTimes(2);
    expect(set).toHaveBeenCalledTimes(FIRESTORE_WRITE_CHUNK_SIZE + 1);
  });

  it("names the collection when a chunk fails", async () => {
    commit.mockRejectedValueOnce(new Error("permission-denied"));
    const { commitBatchSets } = await import("./batchWrite");
    await expect(
      commitBatchSets([
        { collection: "writing", id: "writing-1", data: { title: "Speaker" } },
      ]),
    ).rejects.toThrow(
      "Firestore write failed (1 docs, writing/writing-1): permission-denied",
    );
  });
});
