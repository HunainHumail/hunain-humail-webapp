import { ContactSection } from "@/components/organisms/ContactSection";
import { Hero } from "@/components/organisms/Hero";
import { NowSection } from "@/components/organisms/NowSection";
import { StoryTimeline } from "@/components/organisms/StoryTimeline";
import { WorkGrid } from "@/components/organisms/WorkGrid";
import { WritingList } from "@/components/organisms/WritingList";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import type { Profile } from "@/lib/schemas/profile";
import type { NowItem } from "@/lib/schemas/now";
import type { NavItem, SiteSettings } from "@/lib/schemas/siteSettings";
import type { StoryItem } from "@/lib/schemas/story";
import type { WorkItem } from "@/lib/schemas/work";
import type { WritingItem } from "@/lib/schemas/writing";
import { homeWorkPreview } from "@/lib/utils/homeWorkPreview";

export interface HomeTemplateProps {
  settings: SiteSettings;
  profile: Profile;
  story: StoryItem[];
  now: NowItem[];
  work: WorkItem[];
  writing: WritingItem[];
  knownWorkSlugs?: readonly string[];
}

function navFor(settings: SiteSettings, href: string): NavItem | undefined {
  return settings.nav.find(
    (item) => item.href === href || item.href === `/${href}`,
  );
}

export function HomeTemplate({
  settings,
  profile,
  story,
  now,
  work,
  writing,
  knownWorkSlugs,
}: HomeTemplateProps) {
  const storyNav = navFor(settings, "#story");
  const nowNav = navFor(settings, "#now");
  const workNav = navFor(settings, "/work") ?? navFor(settings, "#work");
  const writingNav = navFor(settings, "#writing");
  const contactNav = navFor(settings, "#contact");

  return (
    <SiteTemplate settings={settings} avatars={profile.avatars}>
      <Hero
        name={profile.name}
        headline={profile.headline}
        location={profile.location}
        avatars={profile.avatars}
        chips={profile.chips}
        terminalLines={profile.terminalLines}
        ctas={profile.ctas}
      />
      <StoryTimeline
        items={story}
        index={storyNav?.number}
        label={storyNav?.label}
      />
      <NowSection items={now} index={nowNav?.number} label={nowNav?.label} />
      <WorkGrid
        items={homeWorkPreview(work)}
        totalCount={work.length}
        index={workNav?.number}
        label={workNav?.label}
        viewAllHref="/work"
        showFilters={false}
        knownWorkSlugs={knownWorkSlugs}
      />
      <WritingList
        items={writing}
        index={writingNav?.number}
        label={writingNav?.label}
      />
      <ContactSection
        contact={settings.contact}
        index={contactNav?.number}
        label={contactNav?.label}
      />
    </SiteTemplate>
  );
}
