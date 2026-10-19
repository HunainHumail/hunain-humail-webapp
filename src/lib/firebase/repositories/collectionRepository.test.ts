import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCollectionRepository } from "./collectionRepository";

const getFirebaseDb = vi.fn();
const getDocs = vi.fn();
const getDoc = vi.fn();
const setDoc = vi.fn();
const deleteDoc = vi.fn();
const commit = vi.fn();
const update = vi.fn();
const onSnapshot = vi.fn();

vi.mock("../client", () => ({
  getFirebaseDb: () => getFirebaseDb(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((_db: unknown, name: string) => ({ path: name })),
  doc: vi.fn((_db: unknown, name: string, id: string) => ({
    path: `${name}/${id}`,
  })),
  query: vi.fn((...args: unknown[]) => args),
  where: vi.fn((...args: unknown[]) => args),
  orderBy: vi.fn((...args: unknown[]) => args),
  limit: vi.fn((...args: unknown[]) => args),
  getDocs: (...args: unknown[]) => getDocs(...args),
  getDoc: (...args: unknown[]) => getDoc(...args),
  setDoc: (...args: unknown[]) => setDoc(...args),
  deleteDoc: (...args: unknown[]) => deleteDoc(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
  writeBatch: () => ({ update, commit }),
}));

interface SampleDoc {
  id: string;
  title: string;
  status: string;
  order: number;
  company?: string;
}

const repo = createCollectionRepository<SampleDoc>("story");

describe("createCollectionRepository", () => {
  beforeEach(() => {
    getFirebaseDb.mockReturnValue({ name: "db" });
    getDocs.mockReset();
    getDoc.mockReset();
    setDoc.mockReset();
    deleteDoc.mockReset();
    commit.mockReset();
    update.mockReset();
    onSnapshot.mockReset();
  });

  it("throws when Firebase is not configured", async () => {
    getFirebaseDb.mockReturnValue(null);
    await expect(repo.listPublished()).rejects.toThrow(
      "Firebase is not configured",
    );
  });

  it("lists every document and subscribes to changes", async () => {
    getDocs.mockResolvedValue({
      docs: [
        { id: "a", data: () => ({ title: "A", status: "draft", order: 1 }) },
      ],
    });
    await expect(repo.list()).resolves.toEqual([
      { id: "a", title: "A", status: "draft", order: 1 },
    ]);

    const onChange = vi.fn();
    onSnapshot.mockImplementation(
      (_query: unknown, success: (snapshot: unknown) => void) => {
        success({
          docs: [{ id: "a", data: () => ({ title: "A", order: 1 }) }],
        });
        return vi.fn();
      },
    );
    const unsubscribe = repo.subscribe(onChange);
    expect(onChange).toHaveBeenCalledWith([{ id: "a", title: "A", order: 1 }]);
    expect(typeof unsubscribe).toBe("function");
  });

  it("lists published documents in order", async () => {
    getDocs.mockResolvedValue({
      docs: [
        { id: "a", data: () => ({ title: "A", status: "published", order: 0 }) },
      ],
    });

    await expect(repo.listPublished()).resolves.toEqual([
      { id: "a", title: "A", status: "published", order: 0 },
    ]);
  });

  it("returns a document by id or null", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      id: "a",
      data: () => ({ title: "A" }),
    });
    await expect(repo.getById("a")).resolves.toEqual({ id: "a", title: "A" });

    getDoc.mockResolvedValueOnce({ exists: () => false });
    await expect(repo.getById("missing")).resolves.toBeNull();
  });

  it("returns a published document by slug or null", async () => {
    getDocs.mockResolvedValueOnce({
      docs: [{ id: "w1", data: () => ({ slug: "trinnect", title: "Trinnect" }) }],
    });
    await expect(repo.getBySlug("trinnect")).resolves.toEqual({
      id: "w1",
      slug: "trinnect",
      title: "Trinnect",
    });

    getDocs.mockResolvedValueOnce({ docs: [] });
    await expect(repo.getBySlug("missing")).resolves.toBeNull();
  });

  it("upserts, deletes, and reorders", async () => {
    const data = {
      id: "a",
      title: "A",
      status: "published",
      order: 0,
    };
    await repo.upsert("a", { ...data, company: undefined });
    expect(setDoc).toHaveBeenCalledWith(
      { path: "story/a" },
      data,
      { merge: true },
    );

    await repo.delete("a");
    expect(deleteDoc).toHaveBeenCalled();

    await repo.reorder(["b", "a"]);
    expect(update).toHaveBeenCalledTimes(2);
    expect(commit).toHaveBeenCalledTimes(1);
  });
});
