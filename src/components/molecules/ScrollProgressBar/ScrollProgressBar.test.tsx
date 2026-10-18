import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ScrollProgressBar } from "./ScrollProgressBar";

describe("ScrollProgressBar", () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  it("exposes scroll progressbar", () => {
    render(<ScrollProgressBar />);
    expect(screen.getByRole("progressbar", { name: /scroll progress/i })).toBeInTheDocument();
  });
});
