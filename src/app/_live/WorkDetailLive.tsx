"use client";

import { CaseStudyTemplate } from "@/components/templates/CaseStudyTemplate";
import { useClientSeoTitle, useLiveContent } from "@/hooks/useLiveContent";
import type { Profile } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import type { WorkItem } from "@/lib/schemas/work";

export interface WorkDetailLiveProps {
  settings: SiteSettings;
  item: WorkItem;
  profile: Profile;
}

export function WorkDetailLive({
  settings: initialSettings,
  item,
  profile: initialProfile,
}: WorkDetailLiveProps) {
  const settings = useLiveContent("settings", initialSettings);
  const profile = useLiveContent("profile", initialProfile);
  const work = useLiveContent("work", [item]);
  const liveItem = work.find((entry) => entry.slug === item.slug) ?? item;
  useClientSeoTitle(`${liveItem.title} · Hunain Humail`);

  return (
    <CaseStudyTemplate
      settings={settings}
      item={liveItem}
      avatars={profile.avatars}
    />
  );
}
