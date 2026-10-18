import { render, screen } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { DubaiClock } from "./DubaiClock";

describe("DubaiClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-18T16:30:45Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows Dubai clock label", () => {
    render(<DubaiClock />);
    expect(screen.getByText(/^DUBAI · 25\.20° N · /)).toBeInTheDocument();
  });
});
