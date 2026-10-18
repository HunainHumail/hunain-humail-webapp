import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import {
  connectStorageEmulator,
  getStorage,
  type FirebaseStorage,
} from "firebase/storage";
import {
  getFirebaseWebConfig,
  isFirebaseEmulatorEnabled,
} from "@/lib/env";
import { FIREBASE_EMULATORS } from "./constants";

interface FirebaseClients {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

const emulatorState = globalThis as typeof globalThis & {
  __hhFirebaseEmulatorsConnected?: boolean;
};

let clients: FirebaseClients | null | undefined;

function connectEmulators(clientsToConnect: Omit<FirebaseClients, "app">): void {
  if (!isFirebaseEmulatorEnabled() || emulatorState.__hhFirebaseEmulatorsConnected) {
    return;
  }

  const { host, firestorePort, authPort, storagePort } = FIREBASE_EMULATORS;
  connectFirestoreEmulator(clientsToConnect.firestore, host, firestorePort);
  connectAuthEmulator(
    clientsToConnect.auth,
    `http://${host}:${authPort}`,
    { disableWarnings: true },
  );
  connectStorageEmulator(clientsToConnect.storage, host, storagePort);
  emulatorState.__hhFirebaseEmulatorsConnected = true;
}

function getClients(): FirebaseClients | null {
  if (clients !== undefined) {
    return clients;
  }

  const config = getFirebaseWebConfig();
  if (!config) {
    clients = null;
    return null;
  }

  const existing = getApps()[0];
  const app =
    existing ??
    initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    });

  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  connectEmulators({ firestore, auth, storage });

  clients = { app, firestore, auth, storage };
  return clients;
}

export function getFirebaseApp(): FirebaseApp | null {
  return getClients()?.app ?? null;
}

export function getFirebaseDb(): Firestore | null {
  return getClients()?.firestore ?? null;
}

export function getFirebaseAuth(): Auth | null {
  return getClients()?.auth ?? null;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  return getClients()?.storage ?? null;
}
