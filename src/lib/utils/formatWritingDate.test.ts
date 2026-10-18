import { describe, expect, it } from "vitest";
import { formatWritingDate } from "./formatWritingDate";

describe("formatWritingDate", () => {
  it("formats a calendar date as short month and year in UTC", () => {
    expect(formatWritingDate("2023-12-16")).toBe("Dec 2023");
    expect(formatWritingDate("2020-08-01")).toBe("Aug 2020");
  });

  it("formats a full ISO timestamp in UTC", () => {
    expect(formatWritingDate("2026-09-12T00:00:00.000Z")).toBe("Sep 2026");
  });

  it("returns the input when the date is invalid", () => {
    expect(formatWritingDate("not-a-date")).toBe("not-a-date");
  });
});
