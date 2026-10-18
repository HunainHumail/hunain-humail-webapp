import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDubaiClockLabel, useDubaiClock } from "./useDubaiClock";

describe("formatDubaiClockLabel", () => {
  it("formats Dubai time with fixed prefix", () => {
    const date = new Date("2026-10-18T12:34:56Z");
    const label = formatDubaiClockLabel(date);
    expect(label).toMatch(/^DUBAI · 25\.20° N · \d{2}:\d{2}:\d{2}$/);
  });
});

describe("useDubaiClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-18T16:30:45Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates every second", () => {
    const { result } = renderHook(() => useDubaiClock());
    const first = result.current;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toMatch(/^DUBAI · 25\.20° N · /);
    expect(typeof result.current).toBe("string");
    expect(result.current.length).toBeGreaterThan(first.length - 5);
  });
});
