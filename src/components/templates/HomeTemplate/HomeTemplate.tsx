import { ContactSection } from "@/components/organisms/ContactSection";
import { Hero } from "@/components/organisms/Hero";
import { NowSection } from "@/components/organisms/NowSection";
import { StoryTimeline } from "@/components/organisms/StoryTimeline";
import { WorkGrid } from "@/components/organisms/WorkGrid";
import { Testimonials } from "@/components/organisms/Testimonials";
import { WritingList } from "@/components/organisms/WritingList";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import type { Profile } from "@/lib/schemas/profile";
import type { NowItem } from "@/lib/schemas/now";
import type { NavItem, SiteSettings } from "@/lib/schemas/siteSettings";
import type { StoryItem } from "@/lib/schemas/story";
import type { WorkItem } from "@/lib/schemas/work";
import type { Testimonial } from "@/lib/schemas/testimonial";
import type { WritingItem } from "@/lib/schemas/writing";
import { homeWorkPreview } from "@/lib/utils/homeWorkPreview";
import { navWithTestimonials } from "@/lib/utils/navWithTestimonials";

export interface HomeTemplateProps {
  settings: SiteSettings;
  profile: Profile;
  story: StoryItem[];
  now: NowItem[];
  work: WorkItem[];
  writing: WritingItem[];
  testimonials?: Testimonial[];
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
  testimonials = [],
  knownWorkSlugs,
}: HomeTemplateProps) {
  const nav = navWithTestimonials(settings.nav, testimonials.length > 0);
  const publicSettings = { ...settings, nav };
  const storyNav = navFor(publicSettings, "#story");
  const nowNav = navFor(publicSettings, "#now");
  const workNav = navFor(publicSettings, "/work") ?? navFor(publicSettings, "#work");
  const writingNav = navFor(publicSettings, "#writing");
  const testimonialsNav = navFor(publicSettings, "#testimonials");
  const contactNav = navFor(publicSettings, "#contact");

  return (
    <SiteTemplate settings={publicSettings} avatars={profile.avatars}>
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
      <Testimonials
        items={testimonials}
        index={testimonialsNav?.number}
        label={testimonialsNav?.label}
      />
      <ContactSection
        contact={settings.contact}
        index={contactNav?.number}
        label={contactNav?.label}
      />
    </SiteTemplate>
  );
}
