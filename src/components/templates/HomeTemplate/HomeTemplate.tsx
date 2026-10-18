import { Hero } from "@/components/organisms/Hero";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import type { Profile } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";

export interface HomeTemplateProps {
  settings: SiteSettings;
  profile: Profile;
}

export function HomeTemplate({ settings, profile }: HomeTemplateProps) {
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
    </SiteTemplate>
  );
}
