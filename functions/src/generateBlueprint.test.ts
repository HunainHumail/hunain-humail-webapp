// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { HttpsError } from "firebase-functions/v2/https";
import { createGenerateBlueprintHandler } from "./generateBlueprint";
import type { LeadStore } from "./leadStore";
import type { GeminiLlm } from "./geminiClient";

const validRequest = {
  email: "ada@example.com",
  idea: "A booking app for neighbourhood services with reminders.",
  platform: "mobile" as const,
};

const validSpec = {
  appName: "BookIt",
  summary: "Book a local service and get a reminder.",
  audience: "People booking for themselves",
  mvp: "Pick a service and confirm one slot.",
  assumptions: ["One customer per booking.", "The shop lists open slots."],
  later: ["In-app payment", "Reviews"],
  platform: "mobile" as const,
  screens: [
    {
      id: "home",
      title: "Home",
      purpose: "Browse services that are open today.",
      blocks: [
        { type: "header" as const, label: "Home" },
        {
          type: "list" as const,
          label: "Services",
          items: ["Cut", "Colour"],
        },
      ],
    },
    {
      id: "book",
      title: "Book",
      purpose: "Pick a slot.",
      blocks: [
        {
          type: "form" as const,
          label: "Details",
          items: ["Service", "Time"],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      purpose: "Confirmation.",
      blocks: [{ type: "button" as const, label: "Done" }],
    },
  ],
  features: ["Search open services", "Confirm one slot", "Send a reminder"],
};

function mockStore(overrides?: Partial<LeadStore>): LeadStore {
  return {
    reserve: vi.fn().mockResolvedValue({ ok: true }),
    writeLead: vi.fn().mockResolvedValue({ id: "lead-1" }),
    ...overrides,
  };
}

function mockLlm(): GeminiLlm {
  return {
    generate: vi.fn().mockResolvedValue({
      text: JSON.stringify(validSpec),
      inputTokens: 10,
      outputTokens: 20,
    }),
  };
}

describe("createGenerateBlueprintHandler", () => {
  it("rejects invalid input without touching store or llm", async () => {
    const store = mockStore();
    const llm = mockLlm();
    const handler = createGenerateBlueprintHandler({
      llm,
      store,
      hash: { ip: () => "1.1.1.1", hmac: (v) => v },
      now: () => new Date("2026-01-01T00:00:00.000Z"),
      limits: { perIpHour: 5, perEmailHour: 5, dailyCap: 200 },
      modelId: "test-model",
      deadlineMs: 18_000,
    });

    await expect(handler({ data: { email: "bad", idea: "x" } } as never)).rejects.toBeInstanceOf(
      HttpsError,
    );
    expect(store.reserve).not.toHaveBeenCalled();
    expect(store.writeLead).not.toHaveBeenCalled();
    expect(llm.generate).not.toHaveBeenCalled();
  });

  it("returns leadId and spec on success", async () => {
    const store = mockStore();
    const handler = createGenerateBlueprintHandler({
      llm: mockLlm(),
      store,
      hash: { ip: () => "1.1.1.1", hmac: (v) => `hash-${v}` },
      now: () => new Date("2026-01-01T00:00:00.000Z"),
      limits: { perIpHour: 5, perEmailHour: 5, dailyCap: 200 },
      modelId: "test-model",
      deadlineMs: 18_000,
    });

    const result = await handler({
      data: validRequest,
      rawRequest: { ip: "1.1.1.1", headers: {} },
    } as never);

    expect(result).toEqual({ leadId: "lead-1", spec: expect.objectContaining({ appName: "BookIt" }) });
    expect(store.writeLead).toHaveBeenCalled();
  });

  it("throws rate-limit without writing a lead when reserve fails", async () => {
    const store = mockStore({
      reserve: vi.fn().mockResolvedValue({ ok: false, reason: "rate-limit" }),
    });
    const handler = createGenerateBlueprintHandler({
      llm: mockLlm(),
      store,
      hash: { ip: () => "1.1.1.1", hmac: (v) => v },
      now: () => new Date(),
      limits: { perIpHour: 5, perEmailHour: 5, dailyCap: 200 },
      modelId: "test-model",
      deadlineMs: 18_000,
    });

    await expect(
      handler({ data: validRequest, rawRequest: { ip: "1.1.1.1", headers: {} } } as never),
    ).rejects.toMatchObject({ code: "resource-exhausted" });
    expect(store.writeLead).not.toHaveBeenCalled();
  });

  it("skips rate limits for the owner email and for localhost", async () => {
    const store = mockStore({
      reserve: vi.fn().mockResolvedValue({ ok: false, reason: "rate-limit" }),
    });
    const handler = createGenerateBlueprintHandler({
      llm: mockLlm(),
      store,
      hash: { ip: () => "1.1.1.1", hmac: (v) => v },
      now: () => new Date(),
      limits: { perIpHour: 5, perEmailHour: 5, dailyCap: 200 },
      modelId: "test-model",
      deadlineMs: 18_000,
    });

    await handler({
      data: { ...validRequest, email: "hunainhumail786@gmail.com" },
      rawRequest: { ip: "1.1.1.1", headers: {} },
    } as never);

    await handler({
      data: validRequest,
      rawRequest: {
        ip: "1.1.1.1",
        headers: { origin: "http://localhost:3000" },
      },
    } as never);

    expect(store.reserve).not.toHaveBeenCalled();
    expect(store.writeLead).toHaveBeenCalledTimes(2);
  });
});
