import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  initializeApp: vi.fn(() => ({ name: "mock-app" })),
  getApps: vi.fn(() => []),
  getFirestore: vi.fn(() => ({ name: "db" })),
  getAuth: vi.fn(() => ({ name: "auth" })),
  getStorage: vi.fn(() => ({ name: "storage" })),
  connectFirestoreEmulator: vi.fn(),
  connectAuthEmulator: vi.fn(),
  connectStorageEmulator: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  initializeApp: mocks.initializeApp,
  getApps: mocks.getApps,
  getApp: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: mocks.getFirestore,
  connectFirestoreEmulator: mocks.connectFirestoreEmulator,
}));

vi.mock("firebase/auth", () => ({
  getAuth: mocks.getAuth,
  connectAuthEmulator: mocks.connectAuthEmulator,
}));

vi.mock("firebase/storage", () => ({
  getStorage: mocks.getStorage,
  connectStorageEmulator: mocks.connectStorageEmulator,
}));

function stubFirebaseEnv() {
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "key");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "domain");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "project");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "bucket");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "sender");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "app");
}

describe("firebase client", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.clearAllMocks();
    delete (globalThis as { __hhFirebaseEmulatorsConnected?: boolean })
      .__hhFirebaseEmulatorsConnected;
  });

  it("returns null from every getter when Firebase is not configured", async () => {
    const client = await import("./client");
    expect(client.getFirebaseApp()).toBeNull();
    expect(client.getFirebaseDb()).toBeNull();
    expect(client.getFirebaseAuth()).toBeNull();
    expect(client.getFirebaseStorage()).toBeNull();
    expect(mocks.initializeApp).not.toHaveBeenCalled();
  });

  it("initializes app, firestore, auth, and storage from env", async () => {
    stubFirebaseEnv();
    const client = await import("./client");

    expect(client.getFirebaseApp()).toEqual({ name: "mock-app" });
    expect(client.getFirebaseDb()).toEqual({ name: "db" });
    expect(client.getFirebaseAuth()).toEqual({ name: "auth" });
    expect(client.getFirebaseStorage()).toEqual({ name: "storage" });
    expect(mocks.initializeApp).toHaveBeenCalledWith({
      apiKey: "key",
      authDomain: "domain",
      projectId: "project",
      storageBucket: "bucket",
      messagingSenderId: "sender",
      appId: "app",
    });
    expect(mocks.connectFirestoreEmulator).not.toHaveBeenCalled();
  });

  it("connects emulators when NEXT_PUBLIC_USE_FIREBASE_EMULATOR is true", async () => {
    stubFirebaseEnv();
    vi.stubEnv("NEXT_PUBLIC_USE_FIREBASE_EMULATOR", "true");
    const client = await import("./client");

    expect(client.getFirebaseDb()).toEqual({ name: "db" });
    expect(mocks.connectFirestoreEmulator).toHaveBeenCalledWith(
      { name: "db" },
      "127.0.0.1",
      8080,
    );
    expect(mocks.connectAuthEmulator).toHaveBeenCalledWith(
      { name: "auth" },
      "http://127.0.0.1:9099",
      { disableWarnings: true },
    );
    expect(mocks.connectStorageEmulator).toHaveBeenCalledWith(
      { name: "storage" },
      "127.0.0.1",
      9199,
    );
  });
});
