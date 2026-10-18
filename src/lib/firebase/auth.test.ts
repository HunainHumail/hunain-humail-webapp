import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getFirebaseAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  firebaseSignOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: vi.fn(function GoogleAuthProvider(this: {
    providerId: string;
  }) {
    this.providerId = "google.com";
  }),
}));

vi.mock("./client", () => ({
  getFirebaseAuth: mocks.getFirebaseAuth,
}));

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: mocks.GoogleAuthProvider,
  signInWithPopup: mocks.signInWithPopup,
  signOut: mocks.firebaseSignOut,
  onAuthStateChanged: mocks.onAuthStateChanged,
}));

const authClient = { app: "auth" };

describe("firebase auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs in with a Google popup", async () => {
    mocks.getFirebaseAuth.mockReturnValue(authClient);
    const user = { email: "hunainhumail786@gmail.com", emailVerified: true };
    mocks.signInWithPopup.mockResolvedValue({ user });
    const { signInWithGoogle } = await import("./auth");

    await expect(signInWithGoogle()).resolves.toBe(user);
    expect(mocks.GoogleAuthProvider).toHaveBeenCalledOnce();
    expect(mocks.signInWithPopup).toHaveBeenCalledWith(
      authClient,
      expect.any(Object),
    );
  });

  it("throws when signing in without Firebase", async () => {
    mocks.getFirebaseAuth.mockReturnValue(null);
    const { signInWithGoogle } = await import("./auth");

    await expect(signInWithGoogle()).rejects.toThrow("Firebase not configured");
    expect(mocks.signInWithPopup).not.toHaveBeenCalled();
  });

  it("signs out the current session", async () => {
    mocks.getFirebaseAuth.mockReturnValue(authClient);
    mocks.firebaseSignOut.mockResolvedValue(undefined);
    const { signOut } = await import("./auth");

    await signOut();
    expect(mocks.firebaseSignOut).toHaveBeenCalledWith(authClient);
  });

  it("throws when signing out without Firebase", async () => {
    mocks.getFirebaseAuth.mockReturnValue(null);
    const { signOut } = await import("./auth");

    await expect(signOut()).rejects.toThrow("Firebase not configured");
  });

  it("subscribes to auth state", async () => {
    const unsubscribe = vi.fn();
    mocks.getFirebaseAuth.mockReturnValue(authClient);
    mocks.onAuthStateChanged.mockReturnValue(unsubscribe);
    const { onAuthChange } = await import("./auth");
    const listener = vi.fn();

    expect(onAuthChange(listener)).toBe(unsubscribe);
    expect(mocks.onAuthStateChanged).toHaveBeenCalledWith(authClient, listener);
  });

  it("emits a signed-out user when Firebase is not configured", async () => {
    mocks.getFirebaseAuth.mockReturnValue(null);
    const { onAuthChange } = await import("./auth");
    const listener = vi.fn();

    const unsubscribe = onAuthChange(listener);

    expect(listener).toHaveBeenCalledWith(null);
    expect(mocks.onAuthStateChanged).not.toHaveBeenCalled();
    expect(unsubscribe()).toBeUndefined();
  });
});
