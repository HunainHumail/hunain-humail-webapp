"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "@/lib/theme/constants";

const listeners = new Set<() => void>();

function readThemeFromDom(): ThemeMode {
  if (typeof document === "undefined") {
    return "dark";
  }
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" ? "light" : "dark";
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
  const onStorage = () => onStoreChange();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): ThemeMode {
  return "dark";
}

export function useTheme(): {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
} {
  const theme = useSyncExternalStore(
    subscribe,
    readThemeFromDom,
    getServerSnapshot,
  );

  const setTheme = useCallback((next: ThemeMode) => {
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(readThemeFromDom() === "dark" ? "light" : "dark");
  }, []);

  return { theme, setTheme, toggleTheme };
}
