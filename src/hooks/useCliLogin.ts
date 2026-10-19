"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { isFirebaseConfigured } from "@/lib/env";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { submitCliSession } from "@/services/cliSessions";

export type CliLoginStatus =
  | "loading"
  | "unconfigured"
  | "invalid"
  | "confirm"
  | "signing-in"
  | "done"
  | "error";

export interface UseCliLoginResult {
  status: CliLoginStatus;
  code: string;
  sessionId: string;
  error: string | null;
  confirmAndSignIn: () => Promise<void>;
}

function subscribeToSearch(onStoreChange: () => void): () => void {
  window.addEventListener("popstate", onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
  };
}

function getSearchSnapshot(): string {
  return window.location.search;
}

function getServerSearchSnapshot(): string {
  return "";
}

function hasHydratedSnapshot(): boolean {
  return true;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

export function useCliLogin(): UseCliLoginResult {
  const configured = isFirebaseConfigured();
  const hydrated = useSyncExternalStore(
    subscribeToSearch,
    hasHydratedSnapshot,
    getServerHydratedSnapshot,
  );
  const search = useSyncExternalStore(
    subscribeToSearch,
    getSearchSnapshot,
    getServerSearchSnapshot,
  );
  const params = new URLSearchParams(search);
  const sessionId = params.get("session")?.trim() ?? "";
  const code = params.get("code")?.trim() ?? "";
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [done, setDone] = useState(false);

  const confirmAndSignIn = useCallback(async () => {
    if (!configured || !sessionId || !code || signingIn || done) {
      return;
    }

    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
      await submitCliSession({ sessionId, code });
      setDone(true);
    } catch (caught: unknown) {
      const message =
        caught instanceof Error && caught.message
          ? caught.message
          : "Could not authorize the CMS CLI.";
      setError(message);
    } finally {
      setSigningIn(false);
    }
  }, [code, configured, done, sessionId, signingIn]);

  let status: CliLoginStatus;
  if (!configured) {
    status = "unconfigured";
  } else if (!hydrated) {
    status = "loading";
  } else if (done) {
    status = "done";
  } else if (error) {
    status = "error";
  } else if (signingIn) {
    status = "signing-in";
  } else if (!sessionId || !code) {
    status = "invalid";
  } else {
    status = "confirm";
  }

  return {
    status,
    code,
    sessionId,
    error,
    confirmAndSignIn,
  };
}
