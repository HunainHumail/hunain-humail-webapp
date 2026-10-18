import { Hero } from "@/components/organisms/Hero";
import { NowSection } from "@/components/organisms/NowSection";
import { StoryTimeline } from "@/components/organisms/StoryTimeline";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import type { Profile } from "@/lib/schemas/profile";
import type { NowItem } from "@/lib/schemas/now";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import type { StoryItem } from "@/lib/schemas/story";

export interface HomeTemplateProps {
  settings: SiteSettings;
  profile: Profile;
  story: StoryItem[];
  now: NowItem[];
}

export function HomeTemplate({
  settings,
  profile,
  story,
  now,
}: HomeTemplateProps) {
  return (
    <SiteTemplate settings={settings}>
      <Hero
        name={profile.name}
        headline={profile.headline}
        location={profile.location}
        photoUrl={profile.photoUrl}
        chips={profile.chips}
        terminalLines={profile.terminalLines}
        ctas={profile.ctas}
      />
      <StoryTimeline items={story} />
      <NowSection items={now} />
    </SiteTemplate>
  );
}
