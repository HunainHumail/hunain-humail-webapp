import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
  type HttpsCallable,
} from "firebase/functions";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
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

function ensureAppCheck(app: NonNullable<ReturnType<typeof getFirebaseApp>>): void {
  if (functionsState.__hhAppCheckInitialized) {
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
  initializeAppCheck(app, {
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
