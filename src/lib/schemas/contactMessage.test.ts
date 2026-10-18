import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "./contactMessage";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  topic: "Freelance",
  message: "I would like to build an agentic workflow.",
};

describe("contactMessageSchema", () => {
  it("parses a valid message and defaults honeypot to empty", () => {
    const parsed = contactMessageSchema.parse(valid);
    expect(parsed).toEqual({ ...valid, honeypot: "" });
  });

  it("accepts a filled honeypot without failing", () => {
    const parsed = contactMessageSchema.parse({
      ...valid,
      honeypot: "http://spam.example",
    });
    expect(parsed.honeypot).toBe("http://spam.example");
  });

  it("rejects a missing name", () => {
    const result = contactMessageSchema.safeParse({ ...valid, name: "  " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name?.[0]).toBe(
        "Name is required",
      );
    }
  });

  it("rejects an invalid email", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toBe(
        "Enter a valid email",
      );
    }
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      message: "Too short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message?.[0]).toBe(
        "Message must be at least 10 characters",
      );
    }
  });

  it("rejects a message longer than 2000 characters", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message?.[0]).toBe(
        "Message must be at most 2000 characters",
      );
    }
  });
});
