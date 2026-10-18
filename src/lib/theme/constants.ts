export const THEME_STORAGE_KEY = "hh-theme";

export type ThemeMode = "light" | "dark";

export const DEFAULT_THEME: ThemeMode = "dark";

/** Saved choice wins. Otherwise dark — OS `prefers-color-scheme` is ignored. */
export function resolveTheme(stored: string | null): ThemeMode {
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return DEFAULT_THEME;
}

export function themeToggleLabel(theme: ThemeMode): string {
  return theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
}

export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:"${DEFAULT_THEME}";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","${DEFAULT_THEME}");}})();`;
