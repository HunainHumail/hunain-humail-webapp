import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

export type AuthListener = (user: User | null) => void;

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase not configured");
  }
  return auth;
}

export async function signInWithGoogle(): Promise<User> {
  const auth = requireAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOut(): Promise<void> {
  const auth = requireAuth();
  await firebaseSignOut(auth);
}

export function onAuthChange(listener: AuthListener): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    listener(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, listener);
}
