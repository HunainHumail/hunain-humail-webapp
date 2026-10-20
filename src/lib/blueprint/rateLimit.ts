export interface RateLimitKeys {
  ip: string;
  email: string;
  global: string;
}

export interface RateLimitCounts {
  ip: number;
  email: number;
  global: number;
}

export interface RateLimitConfig {
  perIpHour: number;
  perEmailHour: number;
  dailyCap: number;
}

export function hourBucket(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  return `${y}${m}${d}${h}`;
}

export function dayBucket(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function rateLimitKeys(input: {
  ipHash: string;
  emailHash: string;
  now: Date;
}): RateLimitKeys {
  const hour = hourBucket(input.now);
  const day = dayBucket(input.now);
  return {
    ip: `ip_${input.ipHash}_${hour}`,
    email: `email_${input.emailHash}_${hour}`,
    global: `global_${day}`,
  };
}

export function evaluateLimits(
  counts: RateLimitCounts,
  limits: RateLimitConfig,
): { ok: true } | { ok: false; reason: "rate-limit" | "daily-budget" } {
  if (counts.global >= limits.dailyCap) {
    return { ok: false, reason: "daily-budget" };
  }
  if (counts.ip >= limits.perIpHour || counts.email >= limits.perEmailHour) {
    return { ok: false, reason: "rate-limit" };
  }
  return { ok: true };
}

/** Expire one hour after the current window for TTL cleanup. */
export function expiresAt(now: Date): Date {
  return new Date(now.getTime() + 60 * 60 * 1000);
}

const OWNER_TEST_EMAIL = "hunainhumail786@gmail.com";

function headerValue(
  headers: Record<string, unknown> | undefined,
  name: string,
): string | undefined {
  const raw = headers?.[name] ?? headers?.[name.toLowerCase()];
  if (typeof raw === "string") {
    return raw;
  }
  if (Array.isArray(raw) && typeof raw[0] === "string") {
    return raw[0];
  }
  return undefined;
}

function isLocalHost(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  try {
    const url = new URL(value);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/** Owner email and localhost calls skip the hourly and daily caps while testing. */
export function isRateLimitExempt(input: {
  email: string;
  headers?: Record<string, unknown>;
}): boolean {
  if (input.email.trim().toLowerCase() === OWNER_TEST_EMAIL) {
    return true;
  }
  return (
    isLocalHost(headerValue(input.headers, "origin")) ||
    isLocalHost(headerValue(input.headers, "referer"))
  );
}
