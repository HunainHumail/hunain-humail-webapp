import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) =>
    createElement("img", { alt, src }),
}));

afterEach(() => {
  cleanup();
});

const localStorageStore = new Map<string, string>();
const localStorageMock = {
  get length() {
    return localStorageStore.size;
  },
  clear: () => {
    localStorageStore.clear();
  },
  getItem: (key: string) => localStorageStore.get(key) ?? null,
  key: (index: number) => [...localStorageStore.keys()][index] ?? null,
  removeItem: (key: string) => {
    localStorageStore.delete(key);
  },
  setItem: (key: string, value: string) => {
    localStorageStore.set(key, value);
  },
};
vi.stubGlobal("localStorage", localStorageMock);
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: localStorageMock,
  });
}

class MockIntersectionObserver {
  observe() {
    return undefined;
  }
  unobserve() {
    return undefined;
  }
  disconnect() {
    return undefined;
  }
}

vi.stubGlobal(
  "IntersectionObserver",
  MockIntersectionObserver as unknown as typeof IntersectionObserver,
);

class MockResizeObserver {
  observe() {
    return undefined;
  }
  unobserve() {
    return undefined;
  }
  disconnect() {
    return undefined;
  }
}

vi.stubGlobal(
  "ResizeObserver",
  MockResizeObserver as unknown as typeof ResizeObserver,
);

if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
