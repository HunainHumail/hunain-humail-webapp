import { describe, expect, it } from "vitest";
import { buildSitemap } from "./sitemap";

describe("buildSitemap", () => {
  it("lists the home page and each work slug", () => {
    expect(buildSitemap("https://hunain.example/", ["trinnect", "vigil"])).toEqual([
      {
        url: "https://hunain.example",
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: "https://hunain.example/work",
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: "https://hunain.example/work/trinnect",
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: "https://hunain.example/work/vigil",
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ]);
  });

  it("drops empty slugs", () => {
    const urls = buildSitemap("https://hunain.example", ["", "trinnect"]).map(
      (entry) => entry.url,
    );
    expect(urls).toEqual([
      "https://hunain.example",
      "https://hunain.example/work",
      "https://hunain.example/work/trinnect",
    ]);
  });
});
