import { Hero } from "@/components/organisms/Hero";
import { StoryTimeline } from "@/components/organisms/StoryTimeline";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import type { Profile } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import type { StoryItem } from "@/lib/schemas/story";

export interface HomeTemplateProps {
  settings: SiteSettings;
  profile: Profile;
  story: StoryItem[];
}

export function HomeTemplate({ settings, profile, story }: HomeTemplateProps) {
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
    </SiteTemplate>
  );
}
