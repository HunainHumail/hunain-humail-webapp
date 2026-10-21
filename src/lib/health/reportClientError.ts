import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { isBlueprintMockEnabled } from "@/lib/env";
import { getFirebaseDb } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/firebase/constants";
import { HEALTH_FIELD_LIMITS, HEALTH_REPORT_LIMITS } from "./limits";
import { sanitizeHealthText } from "./sanitizeHealthText";

const SESSION_KEY = "hh-health-session";

export interface ClientHealthReport {
  type: string;
  code?: string;
  message?: string;
  redact?: readonly string[];
}

const lastByType = new Map<string, number>();
let sessionReports = 0;
let memorySessionId: string | undefined;

function clip(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max);
}

function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().slice(0, HEALTH_FIELD_LIMITS.sessionId);
  }
  return `s${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`.slice(
    0,
    HEALTH_FIELD_LIMITS.sessionId,
  );
}

function sessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing && existing.length > 0 && existing.length <= HEALTH_FIELD_LIMITS.sessionId) {
      return existing;
    }
    const next = createSessionId();
    sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    if (!memorySessionId) {
      memorySessionId = createSessionId();
    }
    return memorySessionId;
  }
}

function allowReport(type: string, now: number): boolean {
  if (sessionReports >= HEALTH_REPORT_LIMITS.perSession) {
    return false;
  }
  const last = lastByType.get(type);
  if (last !== undefined && now - last < HEALTH_REPORT_LIMITS.perTypeMs) {
    return false;
  }
  lastByType.set(type, now);
  sessionReports += 1;
  return true;
}

function readPage(): string {
  try {
    return clip(window.location.pathname || "", HEALTH_FIELD_LIMITS.page);
  } catch {
    return "";
  }
}

function readUserAgent(): string {
  try {
    return clip(window.navigator.userAgent || "", HEALTH_FIELD_LIMITS.ua);
  } catch {
    return "";
  }
}

/**
 * Fire-and-forget client outage report. Never throws and never blocks the UI.
 * Skipped in blueprint mock mode. Firestore writes do not require App Check.
 */
export function reportClientError(report: ClientHealthReport): void {
  try {
    if (typeof window === "undefined" || isBlueprintMockEnabled()) {
      return;
    }
    const db = getFirebaseDb();
    if (!db) {
      return;
    }
    const type = sanitizeHealthText(report.type, HEALTH_FIELD_LIMITS.type, report.redact);
    if (!type) {
      return;
    }
    if (!allowReport(type, Date.now())) {
      return;
    }
    const code = clip(
      sanitizeHealthText(report.code ?? "", HEALTH_FIELD_LIMITS.code, report.redact),
      HEALTH_FIELD_LIMITS.code,
    );
    const message =
      sanitizeHealthText(
        report.message ?? type,
        HEALTH_FIELD_LIMITS.message,
        report.redact,
      ) || type;
    void addDoc(collection(db, COLLECTIONS.healthEvents), {
      source: "client",
      type,
      code,
      message,
      page: readPage(),
      ua: readUserAgent(),
      sessionId: sessionId(),
      createdAt: serverTimestamp(),
    }).catch(() => undefined);
  } catch {
    return;
  }
}
