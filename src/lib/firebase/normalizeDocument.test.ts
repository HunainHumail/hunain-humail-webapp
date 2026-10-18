import { describe, expect, it } from "vitest";
import { normalizeDocument, normalizeValue } from "./normalizeDocument";

describe("normalizeValue", () => {
  it("converts Timestamp-like values to ISO strings", () => {
    const timestamp = {
      toDate: () => new Date("2026-10-18T00:00:00.000Z"),
    };
    expect(normalizeValue(timestamp)).toBe("2026-10-18T00:00:00.000Z");
  });

  it("walks nested objects and arrays", () => {
    const result = normalizeValue({
      tags: ["a"],
      nested: {
        updatedAt: { toDate: () => new Date("2026-01-01T00:00:00.000Z") },
      },
    });
    expect(result).toEqual({
      tags: ["a"],
      nested: { updatedAt: "2026-01-01T00:00:00.000Z" },
    });
  });
});

describe("normalizeDocument", () => {
  it("merges the document id with normalized fields", () => {
    expect(
      normalizeDocument("story-1", {
        title: "Android freelancer",
        updatedAt: { toDate: () => new Date("2026-10-18T00:00:00.000Z") },
      }),
    ).toEqual({
      id: "story-1",
      title: "Android freelancer",
      updatedAt: "2026-10-18T00:00:00.000Z",
    });
  });
});
