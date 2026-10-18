import { isFirebaseConfigured } from "@/lib/env";

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
