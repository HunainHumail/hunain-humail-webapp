import { describe, expect, it, vi } from "vitest";
import {
  CLI_LOGIN_ORIGIN,
  createLoginChallenge,
  pollCliSession,
  sessionFromRestDocument,
} from "./login";

describe("CMS login polling", () => {
  it("builds a 32-byte session and a 6-character user code URL", () => {
    const challenge = createLoginChallenge(
      () => Uint8Array.from({ length: 32 }, (_, index) => index),
      () => Uint8Array.from([1, 2, 3, 4, 5, 6]),
    );
    expect(challenge.sessionId).toHaveLength(64);
    expect(challenge.userCode).toHaveLength(6);
    expect(challenge.url).toBe(
      `${CLI_LOGIN_ORIGIN}/cli-login?session=${challenge.sessionId}&code=${challenge.userCode}`,
    );
  });

  it("decodes a session document and succeeds after pending polls", async () => {
    const pending = { ok: false, status: 404, json: async () => ({}) };
    const ready = {
      ok: true,
      status: 200,
      json: async () => ({
        fields: {
          refreshToken: { stringValue: "refresh-1" },
          email: { stringValue: "hunainhumail786@gmail.com" },
          code: { stringValue: "AB12CD" },
        },
      }),
    };
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(pending)
      .mockResolvedValueOnce(pending)
      .mockResolvedValueOnce(ready);
    const sleep = vi.fn().mockResolvedValue(undefined);
    let now = 0;

    const session = await pollCliSession({
      projectId: "demo",
      sessionId: "abc",
      fetchFn: fetchFn as unknown as typeof fetch,
      sleep,
      now: () => now,
      intervalMs: 3_000,
      timeoutMs: 10 * 60 * 1000,
    });
    now = 3_000;

    expect(session).toEqual({
      refreshToken: "refresh-1",
      email: "hunainhumail786@gmail.com",
      code: "AB12CD",
    });
    expect(sleep).toHaveBeenCalled();
    expect(sessionFromRestDocument(await ready.json())).toMatchObject({
      refreshToken: "refresh-1",
    });
  });

  it("times out when the session is never written", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });
    let now = 0;
    const sleep = vi.fn().mockImplementation(async (ms: number) => {
      now += ms;
    });

    await expect(
      pollCliSession({
        projectId: "demo",
        sessionId: "abc",
        fetchFn: fetchFn as unknown as typeof fetch,
        sleep,
        now: () => now,
        intervalMs: 3_000,
        timeoutMs: 9_000,
      }),
    ).rejects.toThrow(/timed out/);
  });
});
