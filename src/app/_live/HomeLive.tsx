"use client";

import { useState } from "react";
import {
  HomeTemplate,
  type HomeTemplateProps,
} from "@/components/templates/HomeTemplate";
import { useClientSeoTitle, useLiveContent } from "@/hooks/useLiveContent";

export function HomeLive({
  settings: initialSettings,
  profile: initialProfile,
  story: initialStory,
  now: initialNow,
  work: initialWork,
  writing: initialWriting,
}: HomeTemplateProps) {
  const [knownWorkSlugs] = useState(() =>
    initialWork.map((item) => item.slug),
  );
  const settings = useLiveContent("settings", initialSettings);
  const profile = useLiveContent("profile", initialProfile);
  const story = useLiveContent("story", initialStory);
  const now = useLiveContent("now", initialNow);
  const work = useLiveContent("work", initialWork);
  const writing = useLiveContent("writing", initialWriting);
  useClientSeoTitle(settings.seo.title);

  return (
    <HomeTemplate
      settings={settings}
      profile={profile}
      story={story}
      now={now}
      work={work}
      writing={writing}
      knownWorkSlugs={knownWorkSlugs}
    />
  );
}
