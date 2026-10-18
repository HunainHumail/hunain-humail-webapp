import { describe, expect, it } from "vitest";
import { FALLBACK_SITE_URL, normalizeSiteUrl } from "./siteUrl";

describe("normalizeSiteUrl", () => {
  it("strips a trailing slash", () => {
    expect(normalizeSiteUrl("https://hunain.example/")).toBe(
      "https://hunain.example",
    );
  });

  it("keeps a path and drops its trailing slash", () => {
    expect(normalizeSiteUrl("https://hunain.example/site/")).toBe(
      "https://hunain.example/site",
    );
  });

  it("falls back when the value is not an http(s) url", () => {
    expect(normalizeSiteUrl("")).toBe(FALLBACK_SITE_URL);
    expect(normalizeSiteUrl("not a url")).toBe(FALLBACK_SITE_URL);
    expect(normalizeSiteUrl("mailto:raohunain@hotmail.com")).toBe(
      FALLBACK_SITE_URL,
    );
  });
});
