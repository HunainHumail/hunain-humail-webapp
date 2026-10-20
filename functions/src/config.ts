import { defineInt, defineSecret, defineString } from "firebase-functions/params";

export const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
export const BLUEPRINT_HASH_SALT = defineSecret("BLUEPRINT_HASH_SALT");
export const BLUEPRINT_MODEL = defineString("BLUEPRINT_MODEL", {
  default: "gemini-3.5-flash-lite",
});
export const BLUEPRINT_LIMIT_PER_IP_HOUR = defineInt(
  "BLUEPRINT_LIMIT_PER_IP_HOUR",
  { default: 5 },
);
export const BLUEPRINT_LIMIT_PER_EMAIL_HOUR = defineInt(
  "BLUEPRINT_LIMIT_PER_EMAIL_HOUR",
  { default: 5 },
);
export const BLUEPRINT_DAILY_CAP = defineInt("BLUEPRINT_DAILY_CAP", {
  default: 200,
});
export const REGION = "me-central1";
export const DEADLINE_MS = 18_000;

/** Production site origin for callable CORS (set via firebase functions:config or .env). */
export const PUBLIC_SITE_URL = defineString("PUBLIC_SITE_URL", {
  default: "https://hunain-humail-webapp.web.app",
});
