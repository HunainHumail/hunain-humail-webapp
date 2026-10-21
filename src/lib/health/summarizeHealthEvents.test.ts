import { describe, expect, it } from "vitest";
import { formatHealthTime, HEALTH_TIME_ZONE } from "./formatHealthTime";
import {
  filterHealthEvents,
  healthFailureBannerLabel,
  summarizeHealthEvents,
} from "./summarizeHealthEvents";

describe("formatHealthTime", () => {
  it("formats instants in Asia/Dubai", () => {
    const value = "2026-01-01T00:00:00.000Z";
    expect(HEALTH_TIME_ZONE).toBe("Asia/Dubai");
    expect(formatHealthTime(value)).toBe(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dubai",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value)),
    );
    expect(formatHealthTime(value)).toContain("04:00");
  });
});

describe("summarizeHealthEvents", () => {
  const now = Date.parse("2026-10-21T12:00:00.000Z");
  const events = [
    { source: "client" as const, type: "timeout", createdAt: "2026-10-21T11:00:00.000Z" },
    { source: "server" as const, type: "timeout", createdAt: "2026-10-20T06:00:00.000Z" },
    { source: "server" as const, type: "provider-error", createdAt: "2026-10-18T12:00:00.000Z" },
  ];

  it("filters 24h and 7d windows and counts type and source", () => {
    const day = filterHealthEvents(events, "24h", now);
    expect(day.map((event) => event.type)).toEqual(["timeout"]);
    const week = filterHealthEvents(events, "7d", now);
    expect(week).toHaveLength(3);
    expect(summarizeHealthEvents(week)).toEqual({
      bySource: { client: 1, server: 2 },
      byType: [
        { type: "timeout", count: 2 },
        { type: "provider-error", count: 1 },
      ],
    });
  });

  it("labels the admin banner", () => {
    expect(healthFailureBannerLabel(1)).toBe("1 failure in the last hour");
    expect(healthFailureBannerLabel(4)).toBe("4 failures in the last hour");
  });
});
