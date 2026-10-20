import { createHmac } from "node:crypto";
import type { CallableRequest } from "firebase-functions/v2/https";

export function hmacHex(value: string, salt: string): string {
  return createHmac("sha256", salt).update(value).digest("hex");
}

export function clientIp(rawRequest: CallableRequest["rawRequest"]): string {
  const forwarded = rawRequest.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).split(",")[0]?.trim() ?? "unknown";
  }
  return rawRequest.ip ?? "unknown";
}
