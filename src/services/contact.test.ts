import { afterEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { messagesRepository } from "@/lib/firebase";
import { submitContactMessage } from "./contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  topic: "Freelance",
  message: "I would like to build an agentic workflow.",
};

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/firebase", () => ({
  messagesRepository: {
    create: vi.fn(),
  },
}));

describe("submitContactMessage", () => {
  afterEach(() => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    vi.mocked(messagesRepository.create).mockReset();
  });

  it("validates and returns mock success when Firebase is not configured", async () => {
    const result = await submitContactMessage(valid);
    expect(result).toEqual({ ok: true, id: "mock-message" });
    expect(messagesRepository.create).not.toHaveBeenCalled();
  });

  it("rejects invalid payloads", async () => {
    await expect(
      submitContactMessage({ ...valid, email: "nope" }),
    ).rejects.toThrow();
  });

  it("drops honeypot submissions without writing", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    const result = await submitContactMessage({
      ...valid,
      honeypot: "http://spam.example",
    });
    expect(result.ok).toBe(true);
    expect(messagesRepository.create).not.toHaveBeenCalled();
  });

  it("writes via the messages repository when Firebase is configured", async () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(messagesRepository.create).mockResolvedValue({ id: "msg-1" });

    const result = await submitContactMessage(valid);

    expect(result).toEqual({ ok: true, id: "msg-1" });
    expect(messagesRepository.create).toHaveBeenCalledTimes(1);
    const doc = vi.mocked(messagesRepository.create).mock.calls[0]?.[0];
    expect(doc).toMatchObject({
      name: valid.name,
      email: valid.email,
      topic: valid.topic,
      message: valid.message,
    });
    expect(doc).not.toHaveProperty("honeypot");
    expect(typeof doc?.createdAt).toBe("string");
  });
});
