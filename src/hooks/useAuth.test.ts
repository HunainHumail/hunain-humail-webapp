import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "firebase/auth";
import { ADMIN_EMAIL } from "@/lib/admin";
import { isE2ESignedOut, isFirebaseConfigured } from "@/lib/env";
import { onAuthChange, signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { useAuth } from "./useAuth";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => true),
  isE2ESignedOut: vi.fn(() => false),
}));

vi.mock("@/lib/firebase/auth", () => ({
  onAuthChange: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
}));

function user(email: string, emailVerified = true): User {
  return { email, emailVerified } as User;
}

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(isE2ESignedOut).mockReturnValue(false);
    vi.mocked(onAuthChange).mockReturnValue(() => undefined);
    vi.mocked(signInWithGoogle).mockResolvedValue(user(ADMIN_EMAIL));
    vi.mocked(signOut).mockResolvedValue(undefined);
  });

  it("previews the signed-out guard without contacting auth", () => {
    vi.mocked(isE2ESignedOut).mockReturnValue(true);
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    const { result } = renderHook(() => useAuth());

    expect(result.current.configured).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(onAuthChange).not.toHaveBeenCalled();
  });

  it("stays signed out when Firebase is not configured", () => {
    vi.mocked(isFirebaseConfigured).mockReturnValue(false);
    const { result } = renderHook(() => useAuth());

    expect(result.current.configured).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(onAuthChange).not.toHaveBeenCalled();
  });

  it("loads the session and marks the admin", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.isAdmin).toBe(false);

    const listener = vi.mocked(onAuthChange).mock.calls[0]?.[0];
    act(() => {
      listener?.(user(ADMIN_EMAIL));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user?.email).toBe(ADMIN_EMAIL);
    expect(result.current.isAdmin).toBe(true);
  });

  it("does not treat another verified account as admin", () => {
    const { result } = renderHook(() => useAuth());
    const listener = vi.mocked(onAuthChange).mock.calls[0]?.[0];

    act(() => {
      listener?.(user("guest@example.com"));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it("signs in and signs out through the auth helpers", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signInWithGoogle();
      await result.current.signOut();
    });

    expect(signInWithGoogle).toHaveBeenCalledOnce();
    expect(signOut).toHaveBeenCalledOnce();
    expect(result.current.error).toBeNull();
  });

  it("records a sign-in failure", async () => {
    vi.mocked(signInWithGoogle).mockRejectedValue(new Error("popup closed"));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(result.current.error).toBe("Could not sign in with Google.");
  });

  it("unsubscribes on unmount", () => {
    const unsubscribe = vi.fn();
    vi.mocked(onAuthChange).mockReturnValue(unsubscribe);
    const { unmount } = renderHook(() => useAuth());

    unmount();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
