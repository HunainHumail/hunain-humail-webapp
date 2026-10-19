import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ENV_LINE = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/;

function stripQuotes(value: string): string {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseDotenv(content: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const match = ENV_LINE.exec(rawLine);
    if (!match) {
      continue;
    }
    const key = match[1];
    const value = match[2];
    if (!key || value === undefined) {
      continue;
    }
    parsed[key] = stripQuotes(value);
  }
  return parsed;
}

export function applyDotenv(values: Record<string, string>): void {
  for (const [key, value] of Object.entries(values)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function loadCmsEnv(
  cwd: string = process.cwd(),
): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const name of [".env", ".env.local"]) {
    const filePath = resolve(cwd, name);
    if (!existsSync(filePath)) {
      continue;
    }
    Object.assign(merged, parseDotenv(readFileSync(filePath, "utf8")));
  }
  applyDotenv(merged);
  return merged;
}

export function getCmsFirebaseConfig(): { apiKey: string; projectId: string } {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (!apiKey || !projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID. Add them to .env.local.",
    );
  }
  return { apiKey, projectId };
}
