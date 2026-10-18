import type { Metadata } from "next";
import { HomeTemplate } from "@/components/templates";
import { getSiteUrl } from "@/lib/env";
import { buildHomeMetadata, buildPersonJsonLd, serializeJsonLd } from "@/lib/seo";
import { getProfile } from "@/services/profile";
import { getSiteSettings } from "@/services/siteSettings";
import { getNow } from "@/services/now";
import { getStory } from "@/services/story";
import { getWork } from "@/services/work";
import { getWriting } from "@/services/writing";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildHomeMetadata(settings.seo, getSiteUrl());
}

export default async function Home() {
  const [settings, profile, story, now, work, writing] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getStory(),
    getNow(),
    getWork(),
    getWriting(),
  ]);
  const jsonLd = buildPersonJsonLd({
    name: profile.name,
    sameAs: settings.socials.map((social) => social.href),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <HomeTemplate
        settings={settings}
        profile={profile}
        story={story}
        now={now}
        work={work}
        writing={writing}
      />
    </>
  );
}
