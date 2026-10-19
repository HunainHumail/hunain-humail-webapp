import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Markdown } from "@/components/atoms/Markdown";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { ChipList } from "@/components/molecules/ChipList";
import { Gallery } from "@/components/organisms/Gallery";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import type { ProfileAvatarItem } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import type { WorkItem } from "@/lib/schemas/work";
import { cn } from "@/lib/utils/cn";
import { WORK_CATEGORY_LABELS } from "@/lib/utils/filterWorkByCategory";
import { workMetaLabel } from "@/lib/utils/workMeta";
import { imageUnoptimized } from "@/lib/utils/imageUnoptimized";
import { workCoverAlt, workCoverSrc } from "@/lib/utils/workCover";

export interface CaseStudyTemplateProps {
  settings: SiteSettings;
  item: WorkItem;
  avatars?: readonly ProfileAvatarItem[];
  className?: string;
}

export function CaseStudyTemplate({
  settings,
  item,
  avatars,
  className,
}: CaseStudyTemplateProps) {
  return (
    <SiteTemplate settings={settings} avatars={avatars}>
      <article
        className={cn(
          "border-t border-border py-section md:py-section-lg",
          className,
        )}
      >
        <Container className="max-w-3xl">
          <Link href="/work" className="mb-8 inline-flex text-sm">
            Back to work
          </Link>
          <MonoLabel as="p" className="mb-3">
            {WORK_CATEGORY_LABELS[item.category]}
          </MonoLabel>
          <Heading level={1} size="section" className="mb-4">
            {item.title}
          </Heading>
          {workMetaLabel(item) ? (
            <MonoLabel as="p" className="mb-3">
              {workMetaLabel(item)}
            </MonoLabel>
          ) : null}
          <Text variant="muted" className="mb-8">
            {item.summary}
          </Text>
          {item.coverUrl ? (
            <div className="relative mb-8 aspect-cover overflow-hidden rounded-xl border border-border bg-elevated">
              <Image
                src={workCoverSrc(item.coverUrl, "2x")}
                alt={workCoverAlt(item.title)}
                fill
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
                unoptimized={imageUnoptimized()}
                priority
              />
            </div>
          ) : null}
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <MonoLabel as="p" className="mb-2">
                Role
              </MonoLabel>
              <Text>{item.role}</Text>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <MonoLabel as="p" className="mb-2">
                Stack
              </MonoLabel>
              <ChipList items={item.stack} aria-label="Stack" />
            </div>
          </div>
          <div className="mb-10">
            <MonoLabel as="p" className="mb-3">
              Highlights
            </MonoLabel>
            <ul className="list-disc space-y-2 pl-6 text-text">
              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <Markdown source={item.body} />
          {item.gallery && item.gallery.length > 0 ? (
            <Gallery items={item.gallery} />
          ) : null}
          {item.links && item.links.length > 0 ? (
            <ul className="mt-10 flex flex-col gap-2" aria-label="Project links">
              {item.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </article>
    </SiteTemplate>
  );
}
