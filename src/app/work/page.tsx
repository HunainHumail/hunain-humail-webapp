import type { Metadata } from "next";
import { WorkIndexTemplate } from "@/components/templates";
import { getSiteUrl } from "@/lib/env";
import { buildWorkIndexMetadata } from "@/lib/seo";
import { getProfile } from "@/services/profile";
import { getSiteSettings } from "@/services/siteSettings";
import { getWork } from "@/services/work";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return buildWorkIndexMetadata(getSiteUrl());
}

export default async function WorkIndexPage() {
  const [settings, items, profile] = await Promise.all([
    getSiteSettings(),
    getWork(),
    getProfile(),
  ]);
  return (
    <WorkIndexTemplate
      settings={settings}
      items={items}
      avatars={profile.avatars}
    />
  );
}
