import type { MetadataRoute } from "next";
import { normalizeSiteUrl } from "./siteUrl";

export function buildSitemap(
  siteUrl: string,
  slugs: readonly string[],
): MetadataRoute.Sitemap {
  const base = normalizeSiteUrl(siteUrl);
  const work = slugs
    .filter((slug) => slug.length > 0)
    .map((slug) => ({
      url: `${base}/work/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/work`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...work,
  ];
}
