import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DUBAI_CLOCK_PREFIX,
  formatDubaiClockLabel,
  useDubaiClock,
} from "./useDubaiClock";

describe("formatDubaiClockLabel", () => {
  it("formats Dubai time with fixed prefix", () => {
    const date = new Date("2026-10-18T12:34:56Z");
    const label = formatDubaiClockLabel(date);
    expect(label).toMatch(/^DUBAI · 25\.20° N · \d{2}:\d{2}:\d{2}$/);
    expect(label.startsWith(DUBAI_CLOCK_PREFIX)).toBe(true);
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

  it("fills in the time after mount and updates every second", () => {
    const { result } = renderHook(() => useDubaiClock());
    expect(result.current).toMatch(/^DUBAI · 25\.20° N · /);

    const first = result.current;
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toMatch(/^DUBAI · 25\.20° N · /);
    expect(typeof result.current).toBe("string");
    expect(result.current.length).toBeGreaterThan(first.length - 5);
  });
});
