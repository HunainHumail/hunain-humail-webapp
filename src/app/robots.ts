import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { buildRobots } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(getSiteUrl());
}
