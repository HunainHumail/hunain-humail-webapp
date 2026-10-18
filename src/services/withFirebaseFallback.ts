import { isFirebaseConfigured } from "@/lib/env";

export function listOrSeed<T>(loaded: readonly T[], seed: readonly T[]): T[] {
  if (loaded.length === 0) {
    return [...seed];
  }
  return [...loaded];
}

export async function withFirebaseFallback<T>(
  load: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  if (!isFirebaseConfigured()) {
    return fallback();
  }

  try {
    return await load();
  } catch {
    return fallback();
  }
}
