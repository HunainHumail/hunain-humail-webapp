import { describe, expect, it } from "vitest";
import { workSeed } from "@/lib/seed/work";
import {
  HOME_WORK_PREVIEW_SLUGS,
  homeWorkPreview,
} from "./homeWorkPreview";

describe("homeWorkPreview", () => {
  it("keeps the five featured projects first, then the curated subset", () => {
    const preview = homeWorkPreview(workSeed);
    expect(preview.map((item) => item.slug)).toEqual([
      ...HOME_WORK_PREVIEW_SLUGS,
    ]);
    expect(preview.slice(0, 5).every((item) => item.featured)).toBe(true);
    expect(preview).toHaveLength(HOME_WORK_PREVIEW_SLUGS.length);
    expect(preview.some((item) => item.slug === "tecobi")).toBe(false);
  });
});
