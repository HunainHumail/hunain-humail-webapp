"use client";

import { useState } from "react";
import { WorkIndexTemplate } from "@/components/templates/WorkIndexTemplate";
import { useLiveContent } from "@/hooks/useLiveContent";
import type { Profile } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import type { WorkItem } from "@/lib/schemas/work";

export interface WorkIndexLiveProps {
  settings: SiteSettings;
  items: WorkItem[];
  profile: Profile;
}

export function WorkIndexLive({
  settings: initialSettings,
  items: initialItems,
  profile: initialProfile,
}: WorkIndexLiveProps) {
  const [knownWorkSlugs] = useState(() =>
    initialItems.map((item) => item.slug),
  );
  const settings = useLiveContent("settings", initialSettings);
  const profile = useLiveContent("profile", initialProfile);
  const items = useLiveContent("work", initialItems);

  return (
    <WorkIndexTemplate
      settings={settings}
      items={items}
      avatars={profile.avatars}
      knownWorkSlugs={knownWorkSlugs}
    />
  );
}
