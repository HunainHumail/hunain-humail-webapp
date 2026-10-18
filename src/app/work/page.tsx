import type { Metadata } from "next";
import { WorkIndexTemplate } from "@/components/templates";
import { getSiteUrl } from "@/lib/env";
import { buildWorkIndexMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/services/siteSettings";
import { getWork } from "@/services/work";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return buildWorkIndexMetadata(getSiteUrl());
}

export default async function WorkIndexPage() {
  const [settings, items] = await Promise.all([getSiteSettings(), getWork()]);
  return <WorkIndexTemplate settings={settings} items={items} />;
}
