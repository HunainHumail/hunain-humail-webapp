import { describe, expect, it } from "vitest";
import {
  formatUpdatedMonthYear,
  latestUpdatedAtIso,
} from "./formatUpdatedMonthYear";

describe("formatUpdatedMonthYear", () => {
  it("formats UTC month and year", () => {
    expect(formatUpdatedMonthYear("2026-10-01T00:00:00.000Z")).toBe(
      "Updated Oct 2026",
    );
  });
});

describe("latestUpdatedAtIso", () => {
  it("returns the newest updatedAt", () => {
    expect(
      latestUpdatedAtIso([
        { updatedAt: "2026-01-01T00:00:00.000Z" },
        { updatedAt: "2026-10-01T00:00:00.000Z" },
        { updatedAt: "2026-03-01T00:00:00.000Z" },
      ]),
    ).toBe("2026-10-01T00:00:00.000Z");
  });
});
