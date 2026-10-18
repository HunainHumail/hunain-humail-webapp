import { beforeEach, describe, expect, it, vi } from "vitest";
import { messagesRepository } from "./messagesRepository";

const getFirebaseDb = vi.fn();
const addDoc = vi.fn();
const getDocs = vi.fn();
const updateDoc = vi.fn();
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
  orderBy: vi.fn((...args: unknown[]) => args),
  addDoc: (...args: unknown[]) => addDoc(...args),
  getDocs: (...args: unknown[]) => getDocs(...args),
  updateDoc: (...args: unknown[]) => updateDoc(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
}));

const message = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  topic: "Freelance",
  message: "I would like to build an agentic workflow.",
  createdAt: "2026-10-18T00:00:00.000Z",
};

describe("messagesRepository", () => {
  beforeEach(() => {
    getFirebaseDb.mockReturnValue({ name: "db" });
    addDoc.mockReset();
    getDocs.mockReset();
    updateDoc.mockReset();
    onSnapshot.mockReset();
  });

  it("throws when Firebase is not configured", async () => {
    getFirebaseDb.mockReturnValue(null);
    await expect(messagesRepository.create(message)).rejects.toThrow(
      "Firebase is not configured",
    );
  });

  it("creates a message and returns the generated id", async () => {
    addDoc.mockResolvedValue({ id: "msg-1" });
    await expect(messagesRepository.create(message)).resolves.toEqual({
      id: "msg-1",
    });
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  it("lists messages and marks one read", async () => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "msg-1",
          data: () => message,
        },
      ],
    });
    await expect(messagesRepository.list()).resolves.toEqual([
      { id: "msg-1", ...message, read: false },
    ]);

    await messagesRepository.markRead("msg-1");
    expect(updateDoc).toHaveBeenCalledWith(
      { path: "messages/msg-1" },
      { read: true },
    );
  });

  it("subscribes to the inbox", () => {
    const onChange = vi.fn();
    onSnapshot.mockImplementation(
      (_query: unknown, success: (snapshot: unknown) => void) => {
        success({
          docs: [{ id: "msg-1", data: () => ({ ...message, read: true }) }],
        });
        return vi.fn();
      },
    );
    messagesRepository.subscribe(onChange);
    expect(onChange).toHaveBeenCalledWith([
      { id: "msg-1", ...message, read: true },
    ]);
  });
});
