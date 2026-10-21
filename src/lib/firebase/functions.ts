import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
  type HttpsCallable,
} from "firebase/functions";
import {
  initializeAppCheck,
  getToken,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from "firebase/app-check";
import type { BlueprintRequest } from "@/lib/schemas/blueprint";
import {
  getAppCheckSiteKey,
  getFunctionsRegion,
  isFirebaseEmulatorEnabled,
} from "@/lib/env";
import { getFirebaseApp } from "./client";
import { FIREBASE_EMULATORS } from "./constants";

const functionsState = globalThis as typeof globalThis & {
  __hhFunctionsEmulatorConnected?: boolean;
  __hhAppCheckInitialized?: boolean;
};

let callable: HttpsCallable<BlueprintRequest, unknown> | null = null;
let appCheckInstance: AppCheck | null = null;

/** Thrown when an App Check token could not be obtained on the client. */
export class AppCheckTokenError extends Error {
  readonly code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = "AppCheckTokenError";
    this.code = code;
  }
}

function ensureAppCheck(app: NonNullable<ReturnType<typeof getFirebaseApp>>): void {
  if (functionsState.__hhAppCheckInitialized && appCheckInstance) {
    return;
  }
  const siteKey = getAppCheckSiteKey();
  if (!siteKey) {
    throw new Error("App Check is not configured");
  }
  const useDebugToken =
    isFirebaseEmulatorEnabled() || process.env.NODE_ENV === "development";
  if (useDebugToken) {
    (
      globalThis as typeof globalThis & {
        FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean;
      }
    ).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  appCheckInstance = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
  functionsState.__hhAppCheckInitialized = true;
}

export async function warmUpAppCheck(): Promise<void> {
  const app = getFirebaseApp();
  if (!app || !getAppCheckSiteKey()) {
    return;
  }
  ensureAppCheck(app);
  // Prime the token in the background so the first submit is fast.
  void getToken(appCheckInstance as AppCheck, false).catch(() => undefined);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Make sure a valid App Check token exists BEFORE calling the function.
 * The Functions SDK silently sends the request without a token when
 * getToken fails (e.g. reCAPTCHA hiccup, long-idle tab), which the
 * enforced function rejects as UNAUTHENTICATED. We fetch explicitly,
 * retry once with a force refresh, and surface a precise error.
 */
export async function ensureAppCheckToken(forceRefresh = false): Promise<void> {
  const app = getFirebaseApp();
  if (!app || !getAppCheckSiteKey()) {
    return;
  }
  ensureAppCheck(app);
  const instance = appCheckInstance as AppCheck;
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await getToken(instance, forceRefresh || attempt > 0);
      if (result?.token) {
        return;
      }
    } catch (error: unknown) {
      lastError = error;
      const code = String((error as { code?: unknown })?.code ?? "");
      if (code.includes("throttled")) {
        break; // SDK backoff: retrying immediately won't help.
      }
    }
    if (attempt === 0) {
      await sleep(800);
    }
  }
  const code = String((lastError as { code?: unknown })?.code ?? "appCheck/no-token");
  throw new AppCheckTokenError(code);
}

export async function getBlueprintCallable(): Promise<
  HttpsCallable<BlueprintRequest, unknown>
> {
  if (callable) {
    return callable;
  }
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured");
  }
  ensureAppCheck(app);
  const region = getFunctionsRegion();
  const functions = getFunctions(app, region);
  if (
    isFirebaseEmulatorEnabled() &&
    !functionsState.__hhFunctionsEmulatorConnected
  ) {
    connectFunctionsEmulator(
      functions,
      FIREBASE_EMULATORS.host,
      FIREBASE_EMULATORS.functionsPort,
    );
    functionsState.__hhFunctionsEmulatorConnected = true;
  }
  callable = httpsCallable<BlueprintRequest, unknown>(
    functions,
    "generateBlueprint",
    { timeout: 25_000 },
  );
  return callable;
}
