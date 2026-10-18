import { describe, expect, it } from "vitest";
import { workCoverAlt, workCoverSrc } from "./workCover";

describe("workCoverSrc", () => {
  it("returns the 1x path unchanged", () => {
    expect(workCoverSrc("/projects/trinnect/cover.webp")).toBe(
      "/projects/trinnect/cover.webp",
    );
  });

  it("derives the 2x cover path", () => {
    expect(workCoverSrc("/projects/trinnect/cover.webp", "2x")).toBe(
      "/projects/trinnect/cover@2x.webp",
    );
  });
});

describe("workCoverAlt", () => {
  it("names the cover after the project", () => {
    expect(workCoverAlt("Trinnect")).toBe("Trinnect cover");
  });
});
