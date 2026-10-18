import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { buildSitemap } from "@/lib/seo";
import { getWork } from "@/services/work";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const work = await getWork();
  return buildSitemap(
    getSiteUrl(),
    work.map((item) => item.slug),
  );
}
