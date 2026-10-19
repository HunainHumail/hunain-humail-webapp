import { randomBytes } from "node:crypto";
import { decodeMap } from "./values";

export const CLI_LOGIN_ORIGIN = "https://hunain-humail-webapp.web.app";
export const CLI_SESSION_COLLECTION = "cliSessions";
export const LOGIN_POLL_MS = 3_000;
export const LOGIN_TIMEOUT_MS = 10 * 60 * 1000;
const USER_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export interface LoginChallenge {
  sessionId: string;
  userCode: string;
  url: string;
}

export interface LoginSession {
  refreshToken: string;
  email: string;
  code?: string;
}

function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}

export function createLoginChallenge(
  bytes: () => Uint8Array = () => randomBytes(32),
  codeBytes: () => Uint8Array = () => randomBytes(6),
): LoginChallenge {
  const sessionId = toHex(bytes().subarray(0, 32));
  const raw = codeBytes();
  let userCode = "";
  for (let index = 0; index < 6; index += 1) {
    const value = raw[index] ?? 0;
    userCode += USER_CODE_ALPHABET[value % USER_CODE_ALPHABET.length];
  }
  const url = `${CLI_LOGIN_ORIGIN}/cli-login?session=${encodeURIComponent(sessionId)}&code=${encodeURIComponent(userCode)}`;
  return { sessionId, userCode, url };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function sessionFromRestDocument(body: unknown): LoginSession | null {
  if (!isRecord(body) || !isRecord(body.fields)) {
    return null;
  }
  const decoded = decodeMap(body.fields);
  const refreshToken =
    typeof decoded.refreshToken === "string" ? decoded.refreshToken : "";
  const email = typeof decoded.email === "string" ? decoded.email : "";
  if (!refreshToken || !email) {
    return null;
  }
  return {
    refreshToken,
    email,
    code: typeof decoded.code === "string" ? decoded.code : undefined,
  };
}

export function cliSessionUrl(projectId: string, sessionId: string): string {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${CLI_SESSION_COLLECTION}/${encodeURIComponent(sessionId)}`;
}

export async function pollCliSession(options: {
  projectId: string;
  sessionId: string;
  fetchFn?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  intervalMs?: number;
  timeoutMs?: number;
}): Promise<LoginSession> {
  const fetchFn = options.fetchFn ?? fetch;
  const sleep =
    options.sleep ??
    ((ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      }));
  const now = options.now ?? Date.now;
  const intervalMs = options.intervalMs ?? LOGIN_POLL_MS;
  const timeoutMs = options.timeoutMs ?? LOGIN_TIMEOUT_MS;
  const deadline = now() + timeoutMs;
  const url = cliSessionUrl(options.projectId, options.sessionId);

  while (now() <= deadline) {
    const response = await fetchFn(url);
    if (response.ok) {
      const session = sessionFromRestDocument(await response.json());
      if (session) {
        return session;
      }
    } else if (response.status !== 404 && response.status !== 403) {
      throw new Error(`Login poll failed (${response.status})`);
    }
    if (now() + intervalMs > deadline) {
      break;
    }
    await sleep(intervalMs);
  }

  throw new Error("Login timed out. Run `npm run cms -- login` again.");
}
