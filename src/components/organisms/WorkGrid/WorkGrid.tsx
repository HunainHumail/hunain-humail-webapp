"use client";

import { Container } from "@/components/atoms/Container";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";
import { CaseStudyCard } from "@/components/molecules/CaseStudyCard";
import { FilterTabs } from "@/components/molecules/FilterTabs";
import { RevealGroup } from "@/components/molecules/RevealGroup";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { useWorkFilter } from "@/hooks/useWorkFilter";
import type { WorkItem } from "@/lib/schemas/work";
import { cn } from "@/lib/utils/cn";
import {
  WORK_CATEGORY_LABELS,
  workFilterTabs,
  type WorkFilterCategory,
} from "@/lib/utils/filterWorkByCategory";
import { workCoverAlt } from "@/lib/utils/workCover";

export interface WorkGridProps {
  items: WorkItem[];
  index?: string;
  label?: string;
  title?: string;
  titleId?: string;
  headingLevel?: 1 | 2;
  sectionId?: string;
  viewAllHref?: string;
  className?: string;
}

export function WorkGrid({
  items,
  index = "03",
  label = "Work",
  title = "Things I've built.",
  titleId = "work-heading",
  headingLevel = 2,
  sectionId = "work",
  viewAllHref,
  className,
}: WorkGridProps) {
  const { category, setCategory, filtered } = useWorkFilter(items);
  const tabs = workFilterTabs(items);

  return (
    <section
      id={sectionId}
      className={cn("border-t border-border py-section md:py-section-lg", className)}
      aria-labelledby={titleId}
    >
      <Container>
        <SectionHeader
          index={index}
          eyebrow={label}
          title={title}
          titleId={titleId}
          headingLevel={headingLevel}
        />
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs<WorkFilterCategory>
            tabs={tabs}
            value={category}
            onChange={setCategory}
            aria-label="Filter work by category"
          />
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="inline-flex shrink-0 font-mono text-xs uppercase tracking-wide"
            >
              {`View all projects (${items.length})`}
            </Link>
          ) : null}
        </div>
        <p className="sr-only" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "case study" : "case studies"}
        </p>
        {filtered.length === 0 ? (
          <Text variant="muted">No case studies in this category.</Text>
        ) : (
          <RevealGroup>
            <ul
              className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2"
              aria-label="Case studies"
            >
              {filtered.map((item) => (
                <li
                  key={item.id}
                  data-reveal
                  className={item.featured ? "sm:col-span-2" : undefined}
                >
                  <CaseStudyCard
                    title={item.title}
                    categoryLabel={WORK_CATEGORY_LABELS[item.category]}
                    summary={item.summary}
                    href={`/work/${item.slug}`}
                    featured={item.featured}
                    coverUrl={item.coverUrl}
                    coverAlt={workCoverAlt(item.title)}
                    priority={item.order === 0}
                  />
                </li>
              ))}
            </ul>
          </RevealGroup>
        )}
      </Container>
    </section>
  );
}
