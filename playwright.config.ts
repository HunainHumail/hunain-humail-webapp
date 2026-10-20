import { defineConfig, devices } from "@playwright/test";

const firebaseEnvKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_USE_FIREBASE_EMULATOR",
  "NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED",
] as const;

function e2eServerEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === "string") {
      env[key] = value;
    }
  }

  for (const key of firebaseEnvKeys) {
    env[key] = "";
  }

  env.NEXT_PUBLIC_CONTACT_MOCK = "true";
  env.NEXT_PUBLIC_BLUEPRINT_MOCK = "true";
  env.NEXT_PUBLIC_E2E_SIGNED_OUT = "true";
  env.NEXT_DIST_DIR = ".next-build";
  return env;
}

/** Avoid :3000 — other apps on this machine already listen there, and Playwright would reuse them. */
const e2ePort = 4173;
const e2eOrigin = `http://127.0.0.1:${e2ePort}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : "html",
  use: {
    baseURL: e2eOrigin,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    { name: "Pixel 7", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- --hostname 127.0.0.1 --port ${e2ePort}`,
    url: e2eOrigin,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: e2eServerEnv(),
  },
});
