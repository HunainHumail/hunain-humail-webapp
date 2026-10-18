"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { isAdmin } from "@/lib/admin";
import { isFirebaseConfigured } from "@/lib/env";
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
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) {
      return;
    }

    return onAuthChange((next) => {
      setUser(next);
      setLoading(false);
    });
  }, [configured]);

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
    user: configured ? user : null,
    loading: configured ? loading : false,
    isAdmin: configured ? isAdmin(user) : false,
    configured,
    error,
    signInWithGoogle,
    signOut,
  };
}
