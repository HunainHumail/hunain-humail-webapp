import { describe, expect, it } from "vitest";
import { workMetaLabel } from "./workMeta";

describe("workMetaLabel", () => {
  it("joins company and period", () => {
    expect(workMetaLabel({ company: "Cubix", period: "2021–2023" })).toBe(
      "Cubix · 2021–2023",
    );
  });

  it("returns a single field when the other is missing", () => {
    expect(workMetaLabel({ company: "LuvIQ" })).toBe("LuvIQ");
    expect(workMetaLabel({ period: "2020" })).toBe("2020");
  });

  it("returns undefined when both are empty", () => {
    expect(workMetaLabel({})).toBeUndefined();
  });
});
