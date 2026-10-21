// Fails the static build when Firebase / App Check config is missing or the
// reCAPTCHA Enterprise site key is rejected by Google ("Invalid site key").
// Skip with SKIP_ENV_CHECK=1 (CI without secrets) or when the mock blueprint is on.
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), false);
const env = process.env;
if (env.SKIP_ENV_CHECK === "1" || env.NEXT_PUBLIC_BLUEPRINT_MOCK === "true") {
  console.log("[check-build-env] skipped");
  process.exit(0);
}
const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY",
  "NEXT_PUBLIC_FUNCTIONS_REGION",
];
const missing = required.filter((k) => !env[k]?.trim());
if (missing.length) {
  console.error(`[check-build-env] missing env vars: ${missing.join(", ")}`);
  process.exit(1);
}
const key = env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY.trim();
if (!/^6L[0-9A-Za-z_-]{38}$/.test(key)) {
  console.error("[check-build-env] NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY is malformed");
  process.exit(1);
}
if (env.SKIP_RECAPTCHA_CHECK !== "1") {
  const origin = Buffer.from(`https://${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.web.app:443`)
    .toString("base64").replace(/=/g, ".");
  const url = `https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=${key}&co=${origin}&hl=en&size=invisible`;
  try {
    const html = await (await fetch(url)).text();
    if (/Invalid site key|Invalid domain for site key|Invalid key type/.test(html)) {
      const msg = html.match(/Invalid (site key|domain for site key|key type)/)[0];
      console.error(`[check-build-env] reCAPTCHA rejects the site key: "${msg}". Fix it in Google Cloud > Security > reCAPTCHA (see README "App Check").`);
      process.exit(1);
    }
  } catch (e) {
    console.warn(`[check-build-env] could not reach reCAPTCHA to verify key (${e.message}); continuing`);
  }
}
console.log("[check-build-env] ok");
