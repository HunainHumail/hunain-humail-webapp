import { ADMIN_EMAIL } from "@/lib/admin";
import type { CmsCredentials } from "./credentials";
import { readCredentials, writeCredentials } from "./credentials";

export interface TokenResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IdTokenClaims {
  email: string;
  emailVerified: boolean;
  expiresAt: number;
}

interface CachedIdToken {
  idToken: string;
  expiresAt: number;
}

let cachedToken: CachedIdToken | null = null;

export function resetIdTokenCache(): void {
  cachedToken = null;
}

export function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split(".");
  const payload = parts[1];
  if (!payload) {
    throw new Error("ID token is not a JWT");
  }
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const json = Buffer.from(padded, "base64").toString("utf8");
  const parsed: unknown = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("ID token payload is invalid");
  }
  return parsed as Record<string, unknown>;
}

export function readIdTokenClaims(token: string): IdTokenClaims {
  const payload = decodeJwtPayload(token);
  const email = typeof payload.email === "string" ? payload.email : "";
  const emailVerified = payload.email_verified === true;
  const expiresAt =
    typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  if (!email || !expiresAt) {
    throw new Error("ID token is missing email or expiry");
  }
  return { email, emailVerified, expiresAt };
}

export function assertAdminClaims(claims: IdTokenClaims): void {
  if (claims.email.toLowerCase() !== ADMIN_EMAIL || !claims.emailVerified) {
    throw new Error("Signed-in account is not the verified admin");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function exchangeRefreshToken(
  refreshToken: string,
  apiKey: string,
  fetchFn: typeof fetch = fetch,
): Promise<TokenResponse> {
  const response = await fetchFn(
    `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    },
  );
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || !isRecord(body)) {
    throw new Error("Could not refresh the Firebase ID token");
  }
  const idToken =
    typeof body.id_token === "string" ? body.id_token : "";
  const nextRefresh =
    typeof body.refresh_token === "string" ? body.refresh_token : refreshToken;
  const expiresIn = Number(body.expires_in);
  if (!idToken || !Number.isFinite(expiresIn)) {
    throw new Error("Token endpoint returned an incomplete response");
  }
  return { idToken, refreshToken: nextRefresh, expiresIn };
}

export async function getIdToken(options: {
  apiKey: string;
  now?: () => number;
  fetchFn?: typeof fetch;
  configDir?: string;
  credentials?: CmsCredentials;
}): Promise<{ idToken: string; email: string; credentials: CmsCredentials }> {
  const now = options.now ?? Date.now;
  const stored =
    options.credentials ?? readCredentials(options.configDir ?? undefined);
  if (!stored) {
    throw new Error("Not logged in. Run `npm run cms -- login`.");
  }

  if (cachedToken && cachedToken.expiresAt - 30_000 > now()) {
    return {
      idToken: cachedToken.idToken,
      email: stored.email,
      credentials: stored,
    };
  }

  const exchanged = await exchangeRefreshToken(
    stored.refreshToken,
    options.apiKey,
    options.fetchFn,
  );
  const claims = readIdTokenClaims(exchanged.idToken);
  assertAdminClaims(claims);

  const nextCredentials: CmsCredentials = {
    refreshToken: exchanged.refreshToken,
    email: claims.email,
  };
  writeCredentials(nextCredentials, options.configDir);
  cachedToken = {
    idToken: exchanged.idToken,
    expiresAt: claims.expiresAt,
  };
  return {
    idToken: exchanged.idToken,
    email: claims.email,
    credentials: nextCredentials,
  };
}
