"use client";

import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "@/lib/theme/constants";

const listeners = new Set<() => void>();

function readStoredTheme(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function readTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }
  return resolveTheme(readStoredTheme());
}

function syncThemeAttribute(): void {
  const next = resolveTheme(readStoredTheme());
  if (document.documentElement.getAttribute("data-theme") !== next) {
    document.documentElement.setAttribute("data-theme", next);
  }
}

function emitThemeChange(): void {
  listeners.forEach((listener) => {
    listener();
  });
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable */
  }
  emitThemeChange();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) {
      return;
    }
    syncThemeAttribute();
    onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): ThemeMode {
  return DEFAULT_THEME;
}

export function useTheme(): {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
} {
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    getServerSnapshot,
  );

  useLayoutEffect(() => {
    syncThemeAttribute();
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(readTheme() === "dark" ? "light" : "dark");
  }, []);

  return { theme, setTheme, toggleTheme };
}
