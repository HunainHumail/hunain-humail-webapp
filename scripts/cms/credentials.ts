import {
  chmodSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export interface CmsCredentials {
  refreshToken: string;
  email: string;
}

const FILE_MODE = 0o600;
const DIR_MODE = 0o700;

export function defaultCmsConfigDir(): string {
  if (process.env.HH_CMS_HOME) {
    return process.env.HH_CMS_HOME;
  }
  return join(homedir(), ".config", "hh-cms");
}

export function credentialsPath(configDir: string = defaultCmsConfigDir()): string {
  return join(configDir, "credentials.json");
}

function isCredentials(value: unknown): value is CmsCredentials {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.refreshToken === "string" &&
    record.refreshToken.length > 0 &&
    typeof record.email === "string" &&
    record.email.length > 0
  );
}

export function writeCredentials(
  credentials: CmsCredentials,
  configDir: string = defaultCmsConfigDir(),
): string {
  const filePath = credentialsPath(configDir);
  mkdirSync(dirname(filePath), { recursive: true, mode: DIR_MODE });
  chmodSync(dirname(filePath), DIR_MODE);
  writeFileSync(filePath, `${JSON.stringify(credentials, null, 2)}\n`, {
    encoding: "utf8",
    mode: FILE_MODE,
  });
  chmodSync(filePath, FILE_MODE);
  return filePath;
}

export function readCredentials(
  configDir: string = defaultCmsConfigDir(),
): CmsCredentials | null {
  try {
    const parsed: unknown = JSON.parse(readFileSync(credentialsPath(configDir), "utf8"));
    return isCredentials(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function deleteCredentials(
  configDir: string = defaultCmsConfigDir(),
): boolean {
  try {
    unlinkSync(credentialsPath(configDir));
    return true;
  } catch {
    return false;
  }
}
