import { z } from "zod";

const firebaseEnvSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_USE_FIREBASE_EMULATOR: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED: z.string().optional(),
  STATIC_EXPORT: z.string().optional(),
  NEXT_PUBLIC_STATIC_EXPORT: z.string().optional(),
});

const parsed = firebaseEnvSchema.safeParse({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_USE_FIREBASE_EMULATOR:
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR,
  NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED,
  STATIC_EXPORT: process.env.STATIC_EXPORT,
  NEXT_PUBLIC_STATIC_EXPORT: process.env.NEXT_PUBLIC_STATIC_EXPORT,
});

export const env = parsed.success ? parsed.data : {};

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getFirebaseWebConfig(): FirebaseWebConfig | null {
  const apiKey = env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseWebConfig() !== null;
}

export function isFirebaseEmulatorEnabled(): boolean {
  return env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
}

export function isFirebaseStorageEnabled(): boolean {
  if (env.NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED === "false") {
    return false;
  }
  return (
    env.NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED === "true" ||
    isFirebaseEmulatorEnabled()
  );
}

export function isStaticExport(): boolean {
  return (
    env.STATIC_EXPORT === "true" || env.NEXT_PUBLIC_STATIC_EXPORT === "true"
  );
}
