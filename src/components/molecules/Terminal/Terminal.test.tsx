import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Terminal } from "./Terminal";

const lines = [
  { command: "whoami", output: "hunain — genai engineer" },
  { command: "status", output: "shipping genai" },
];

describe("Terminal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("exposes full terminal text to screen readers", () => {
    render(<Terminal lines={lines} />);
    expect(screen.getByText(/\$ whoami/)).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Terminal" })).toBeInTheDocument();
  });

  it("types the command over time", () => {
    render(<Terminal lines={lines} />);
    const pre = screen.getByRole("group", { name: "Terminal" }).querySelector("pre");
    expect(pre?.textContent).toBe("$ ");

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(pre?.textContent?.startsWith("$ w")).toBe(true);
  });
});
