import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ADMIN_EMAIL } from "@/lib/admin";
import { writeCredentials } from "./credentials";
import {
  decodeJwtPayload,
  getIdToken,
  readIdTokenClaims,
  resetIdTokenCache,
} from "./tokens";

function jwtFor(claims: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "none" })).toString(
    "base64url",
  );
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${header}.${payload}.sig`;
}

describe("CMS token refresh", () => {
  afterEach(() => {
    resetIdTokenCache();
  });

  it("decodes JWT claims", () => {
    const token = jwtFor({
      email: ADMIN_EMAIL,
      email_verified: true,
      exp: 1_700_000_000,
    });
    expect(decodeJwtPayload(token)).toMatchObject({ email: ADMIN_EMAIL });
    expect(readIdTokenClaims(token)).toEqual({
      email: ADMIN_EMAIL,
      emailVerified: true,
      expiresAt: 1_700_000_000_000,
    });
  });

  it("exchanges a refresh token and reuses a cached ID token until it expires", async () => {
    const configDir = mkdtempSync(join(tmpdir(), "hh-cms-token-"));
    writeCredentials(
      { refreshToken: "refresh-1", email: ADMIN_EMAIL },
      configDir,
    );
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id_token: jwtFor({
          email: ADMIN_EMAIL,
          email_verified: true,
          exp: 2_000_000_000,
        }),
        refresh_token: "refresh-2",
        expires_in: "3600",
      }),
    });

    const first = await getIdToken({
      apiKey: "test-key",
      configDir,
      fetchFn: fetchFn as unknown as typeof fetch,
      now: () => 1_000,
    });
    const second = await getIdToken({
      apiKey: "test-key",
      configDir,
      fetchFn: fetchFn as unknown as typeof fetch,
      now: () => 2_000,
    });

    expect(first.email).toBe(ADMIN_EMAIL);
    expect(second.idToken).toBe(first.idToken);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(String(fetchFn.mock.calls[0]?.[0])).toContain(
      "securetoken.googleapis.com/v1/token?key=test-key",
    );
  });

  it("refreshes when the cached ID token is expired", async () => {
    const configDir = mkdtempSync(join(tmpdir(), "hh-cms-token-"));
    writeCredentials(
      { refreshToken: "refresh-1", email: ADMIN_EMAIL },
      configDir,
    );
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id_token: jwtFor({
            email: ADMIN_EMAIL,
            email_verified: true,
            exp: 10,
          }),
          refresh_token: "refresh-2",
          expires_in: "1",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id_token: jwtFor({
            email: ADMIN_EMAIL,
            email_verified: true,
            exp: 2_000_000_000,
          }),
          refresh_token: "refresh-3",
          expires_in: "3600",
        }),
      });

    await getIdToken({
      apiKey: "test-key",
      configDir,
      fetchFn: fetchFn as unknown as typeof fetch,
      now: () => 1_000,
    });
    const refreshed = await getIdToken({
      apiKey: "test-key",
      configDir,
      fetchFn: fetchFn as unknown as typeof fetch,
      now: () => 20_000,
    });

    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(readIdTokenClaims(refreshed.idToken).expiresAt).toBe(
      2_000_000_000_000,
    );
  });

  it("rejects a token whose email is not the admin", async () => {
    const configDir = mkdtempSync(join(tmpdir(), "hh-cms-token-"));
    writeCredentials(
      { refreshToken: "refresh-1", email: ADMIN_EMAIL },
      configDir,
    );
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id_token: jwtFor({
          email: "other@example.com",
          email_verified: true,
          exp: 2_000_000_000,
        }),
        refresh_token: "refresh-2",
        expires_in: "3600",
      }),
    });

    await expect(
      getIdToken({
        apiKey: "test-key",
        configDir,
        fetchFn: fetchFn as unknown as typeof fetch,
      }),
    ).rejects.toThrow("Signed-in account is not the verified admin");
  });
});
