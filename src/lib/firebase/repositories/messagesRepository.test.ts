import { beforeEach, describe, expect, it, vi } from "vitest";
import { messagesRepository } from "./messagesRepository";

const getFirebaseDb = vi.fn();
const addDoc = vi.fn();

vi.mock("../client", () => ({
  getFirebaseDb: () => getFirebaseDb(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((_db: unknown, name: string) => ({ path: name })),
  addDoc: (...args: unknown[]) => addDoc(...args),
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
});
