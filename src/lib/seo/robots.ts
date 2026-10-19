import type { MetadataRoute } from "next";
import { normalizeSiteUrl } from "./siteUrl";

export function buildRobots(siteUrl: string): MetadataRoute.Robots {
  const base = normalizeSiteUrl(siteUrl);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cli-login"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
