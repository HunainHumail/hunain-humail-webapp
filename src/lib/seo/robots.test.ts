import { describe, expect, it } from "vitest";
import { buildRobots } from "./robots";

describe("buildRobots", () => {
  it("allows the public site, disallows admin, and points at the sitemap", () => {
    expect(buildRobots("https://hunain.example/")).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
      sitemap: "https://hunain.example/sitemap.xml",
    });
  });
});
