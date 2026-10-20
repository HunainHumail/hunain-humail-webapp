"use client";

import { useCallback, useState } from "react";
import {
  HomeTemplate,
  type HomeTemplateProps,
} from "@/components/templates/HomeTemplate";
import { useClientSeoTitle, useLiveContent } from "@/hooks/useLiveContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ContactPrefill } from "@/lib/schemas/blueprint";

export interface HomeLiveProps extends HomeTemplateProps {
  blueprintEnabled: boolean;
}

export function HomeLive({
  settings: initialSettings,
  profile: initialProfile,
  story: initialStory,
  now: initialNow,
  work: initialWork,
  writing: initialWriting,
  testimonials: initialTestimonials = [],
  blueprint,
  blueprintEnabled,
}: HomeLiveProps) {
  const [knownWorkSlugs] = useState(() =>
    initialWork.map((item) => item.slug),
  );
  const [contactPrefill, setContactPrefill] = useState<
    ContactPrefill | undefined
  >();
  const reducedMotion = useReducedMotion();

  const settings = useLiveContent("settings", initialSettings);
  const profile = useLiveContent("profile", initialProfile);
  const story = useLiveContent("story", initialStory);
  const now = useLiveContent("now", initialNow);
  const work = useLiveContent("work", initialWork);
  const writing = useLiveContent("writing", initialWriting);
  const testimonials = useLiveContent("testimonials", initialTestimonials);
  useClientSeoTitle(settings.seo.title);

  const onBlueprintDiscuss = useCallback(
    (prefill: ContactPrefill) => {
      setContactPrefill(prefill);
      requestAnimationFrame(() => {
        document.getElementById("contact")?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
        });
        const nameInput = document.querySelector<HTMLInputElement>(
          "#contact input[name='name']",
        );
        nameInput?.focus();
      });
    },
    [reducedMotion],
  );

  return (
    <HomeTemplate
      settings={settings}
      profile={profile}
      story={story}
      now={now}
      work={work}
      writing={writing}
      testimonials={testimonials}
      knownWorkSlugs={knownWorkSlugs}
      blueprint={blueprint}
      blueprintEnabled={blueprintEnabled}
      contactPrefill={contactPrefill}
      onBlueprintDiscuss={onBlueprintDiscuss}
    />
  );
}
