"use client";

import { Button } from "@/components/atoms/Button";
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
import { workDetailHref } from "@/lib/utils/workHref";
import { workMetaLabel } from "@/lib/utils/workMeta";

export interface WorkGridProps {
  items: WorkItem[];
  index?: string;
  label?: string;
  title?: string;
  titleId?: string;
  headingLevel?: 1 | 2;
  sectionId?: string;
  viewAllHref?: string;
  totalCount?: number;
  showFilters?: boolean;
  pageSize?: number;
  knownWorkSlugs?: readonly string[];
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
  totalCount,
  showFilters = true,
  pageSize,
  knownWorkSlugs,
  className,
}: WorkGridProps) {
  const { category, setCategory, filtered, visible, canLoadMore, loadMore } =
    useWorkFilter(items, pageSize);
  const tabs = workFilterTabs(items);
  const viewAllCount = totalCount ?? items.length;

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
        <div
          className={cn(
            "mb-8 flex gap-4",
            showFilters
              ? "flex-col sm:flex-row sm:items-center sm:justify-between"
              : "justify-end",
          )}
        >
          {showFilters ? (
            <FilterTabs<WorkFilterCategory>
              tabs={tabs}
              value={category}
              onChange={setCategory}
              aria-label="Filter work by category"
            />
          ) : null}
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="inline-flex shrink-0 font-mono text-xs uppercase tracking-wide"
            >
              {`View all projects (${viewAllCount})`}
            </Link>
          ) : null}
        </div>
        <p className="sr-only" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "case study" : "case studies"}
        </p>
        {visible.length === 0 ? (
          <Text variant="muted">No case studies in this category.</Text>
        ) : (
          <RevealGroup>
            <ul
              className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Case studies"
            >
              {visible.map((item) => (
                <li
                  key={item.id}
                  data-reveal
                  className={item.featured ? "sm:col-span-2 lg:col-span-3" : undefined}
                >
                  <CaseStudyCard
                    title={item.title}
                    categoryLabel={WORK_CATEGORY_LABELS[item.category]}
                    summary={item.summary}
                    href={workDetailHref(item.slug, knownWorkSlugs)}
                    featured={item.featured}
                    meta={workMetaLabel(item)}
                    coverUrl={item.coverUrl}
                    coverAlt={workCoverAlt(item.title)}
                    priority={item.order === 0}
                  />
                </li>
              ))}
            </ul>
          </RevealGroup>
        )}
        {canLoadMore ? (
          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={loadMore}
              className="w-full sm:w-auto"
            >
              Load more
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
