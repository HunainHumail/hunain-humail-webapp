"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { isAdmin } from "@/lib/admin";
import { isE2ESignedOut, isFirebaseConfigured } from "@/lib/env";
import {
  onAuthChange,
  signInWithGoogle as signInWithGooglePopup,
  signOut as firebaseSignOut,
} from "@/lib/firebase/auth";

export interface UseAuthResult {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  configured: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

function actionMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message === "Firebase not configured") {
    return error.message;
  }
  return fallback;
}

export function useAuth(): UseAuthResult {
  const previewSignedOut = isE2ESignedOut();
  const configured = isFirebaseConfigured();
  const listen = configured && !previewSignedOut;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(listen);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listen) {
      return;
    }

    return onAuthChange((next) => {
      setUser(next);
      setLoading(false);
    });
  }, [listen]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithGooglePopup();
    } catch (caught) {
      setError(actionMessage(caught, "Could not sign in with Google."));
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut();
    } catch (caught) {
      setError(actionMessage(caught, "Could not sign out."));
    }
  }, []);

  return {
    user: listen ? user : null,
    loading: listen ? loading : false,
    isAdmin: listen ? isAdmin(user) : false,
    configured: previewSignedOut || configured,
    error,
    signInWithGoogle,
    signOut,
  };
}
