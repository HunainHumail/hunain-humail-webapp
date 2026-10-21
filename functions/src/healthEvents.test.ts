// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { createHealthEventWriter } from "./healthEvents";

describe("createHealthEventWriter", () => {
  it("writes a server health event and omits an empty lead id", async () => {
    const add = vi.fn().mockResolvedValue({ id: "h1" });
    const collection = vi.fn(() => ({ add }));
    const db = { collection } as unknown as Firestore;
    const writer = createHealthEventWriter(db);

    await writer.write({
      type: "provider-error",
      code: "internal",
      message: `ada@example.com ${"m".repeat(400)}`,
    });

    expect(collection).toHaveBeenCalledWith("healthEvents");
    const payload = add.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(payload.source).toBe("server");
    expect(payload.type).toBe("provider-error");
    expect(payload.code).toBe("internal");
    expect(String(payload.message).length).toBeLessThanOrEqual(300);
    expect(payload.message).not.toContain("ada@example.com");
    expect(payload).not.toHaveProperty("leadId");
    expect(payload.createdAt).toEqual(FieldValue.serverTimestamp());
  });

  it("stores a lead id when present and propagates write failures", async () => {
    const add = vi.fn().mockRejectedValue(new Error("down"));
    const db = { collection: () => ({ add }) } as unknown as Firestore;
    const writer = createHealthEventWriter(db);

    await expect(
      writer.write({
        type: "timeout",
        code: "deadline-exceeded",
        message: "Timeout",
        leadId: "lead-1",
      }),
    ).rejects.toThrow("down");
    expect(add.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        source: "server",
        type: "timeout",
        leadId: "lead-1",
      }),
    );
  });
});
