// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createLinkHandler } from "./linkBlueprintContact";

describe("createLinkHandler", () => {
  it("sets contactMessageId when unset", async () => {
    const update = vi.fn();
    const tx = {
      get: vi.fn().mockResolvedValue({
        exists: true,
        data: () => ({ contactMessageId: undefined }),
      }),
      update,
    };
    const db = {
      runTransaction: vi.fn(async (fn: (t: typeof tx) => Promise<void>) => fn(tx)),
      collection: vi.fn(() => ({
        doc: vi.fn(() => ({})),
      })),
    };

    const handler = createLinkHandler(db as never);
    await handler({
      params: { messageId: "msg-1" },
      data: {
        data: () => ({ blueprintLeadId: "lead-1" }),
      },
    } as never);

    expect(update).toHaveBeenCalledWith({}, { contactMessageId: "msg-1" });
  });
});
