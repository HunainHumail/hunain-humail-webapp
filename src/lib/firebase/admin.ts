import {
  applicationDefault,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { FIREBASE_EMULATORS } from "./constants";

function isEmulatorEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
}

export function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) {
    return existing;
  }

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.GCLOUD_PROJECT ??
    "your-firebase-project-id";

  if (isEmulatorEnabled()) {
    if (!process.env.FIRESTORE_EMULATOR_HOST) {
      process.env.FIRESTORE_EMULATOR_HOST = `${FIREBASE_EMULATORS.host}:${FIREBASE_EMULATORS.firestorePort}`;
    }
    return initializeApp({ projectId });
  }

  return initializeApp({
    projectId,
    credential: applicationDefault(),
  });
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
