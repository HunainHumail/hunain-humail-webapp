import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_THEME,
  resolveTheme,
  THEME_STORAGE_KEY,
  themeInitScript,
  themeToggleLabel,
} from "./constants";

function preferLightColorScheme(): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-color-scheme: light"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function runThemeInit(): void {
  const script = document.createElement("script");
  script.textContent = themeInitScript;
  document.head.appendChild(script);
  script.remove();
}

describe("theme constants", () => {
  afterEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.clear();
  });

  it("resolves a missing preference to dark", () => {
    expect(resolveTheme(null)).toBe(DEFAULT_THEME);
    expect(resolveTheme("system")).toBe("dark");
    expect(themeToggleLabel("dark")).toBe("Switch to light theme");
    expect(themeToggleLabel("light")).toBe("Switch to dark theme");
  });

  it("keeps a saved light or dark choice", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("defaults to dark when the OS prefers light and nothing is saved", () => {
    localStorage.clear();
    document.documentElement.setAttribute("data-theme", "light");
    preferLightColorScheme();
    expect(themeInitScript).not.toContain("prefers-color-scheme");

    runThemeInit();

    expect(window.matchMedia("(prefers-color-scheme: light)").matches).toBe(
      true,
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("applies a saved light preference before paint", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.setAttribute(
      "data-theme",
      resolveTheme(localStorage.getItem(THEME_STORAGE_KEY)),
    );

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(themeInitScript).toContain(THEME_STORAGE_KEY);
  });
});
