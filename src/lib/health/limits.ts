/** Keep in sync with the `healthEvents` create rule in `firestore.rules`. */
export const HEALTH_FIELD_LIMITS = {
  type: 64,
  code: 80,
  message: 300,
  page: 200,
  ua: 120,
  sessionId: 40,
  leadId: 128,
} as const;

export const HEALTH_REPORT_LIMITS = {
  perTypeMs: 60_000,
  perSession: 5,
} as const;

export const HEALTH_QUERY_LIMIT = 200;
export const HEALTH_LOOKBACK_MS = 7 * 24 * 60 * 60 * 1000;
export const HEALTH_HOUR_MS = 60 * 60 * 1000;
