import { describe, expect, it } from "vitest";
import {
  WORK_VIEW_PATH,
  workDetailHref,
  workSlugFromLocation,
} from "./workHref";

describe("workDetailHref", () => {
  it("uses the static case-study path for slugs baked into the export", () => {
    expect(workDetailHref("trinnect", ["trinnect", "vigil"])).toBe(
      "/work/trinnect",
    );
  });

  it("sends unknown slugs to the client fallback route", () => {
    expect(workDetailHref("cms-new", ["trinnect"])).toBe(
      `${WORK_VIEW_PATH}?slug=cms-new`,
    );
  });

  it("keeps the static path when the known list is omitted", () => {
    expect(workDetailHref("cms-new")).toBe("/work/cms-new");
  });
});

describe("workSlugFromLocation", () => {
  it("reads the slug query on the fallback route", () => {
    expect(workSlugFromLocation("/work/view", "?slug=cms-new")).toBe("cms-new");
  });

  it("reads an unknown /work/:slug path from a hosting rewrite", () => {
    expect(workSlugFromLocation("/work/cms-new", "")).toBe("cms-new");
  });

  it("ignores the fallback path without a query", () => {
    expect(workSlugFromLocation("/work/view", "")).toBeNull();
  });
});
