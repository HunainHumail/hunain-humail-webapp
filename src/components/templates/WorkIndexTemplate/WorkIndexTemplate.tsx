import { WorkGrid } from "@/components/organisms/WorkGrid";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import type { ProfileAvatarItem } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import type { WorkItem } from "@/lib/schemas/work";
import { WORK_INDEX_PAGE_SIZE } from "@/lib/utils/homeWorkPreview";

export interface WorkIndexTemplateProps {
  settings: SiteSettings;
  items: WorkItem[];
  avatars?: readonly ProfileAvatarItem[];
}

export function WorkIndexTemplate({
  settings,
  items,
  avatars,
}: WorkIndexTemplateProps) {
  const workNav =
    settings.nav.find((item) => item.href === "/work") ??
    settings.nav.find((item) => item.href === "#work" || item.href === "/#work");

  return (
    <SiteTemplate settings={settings} avatars={avatars}>
      <WorkGrid
        items={items}
        index={workNav?.number ?? "03"}
        label={workNav?.label ?? "Work"}
        title="All projects"
        titleId="all-projects-heading"
        headingLevel={1}
        sectionId="all-projects"
        pageSize={WORK_INDEX_PAGE_SIZE}
      />
    </SiteTemplate>
  );
}
