"use client";

import { Container } from "@/components/atoms/Container";
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
  WORK_FILTER_TABS,
} from "@/lib/utils/filterWorkByCategory";

export interface WorkGridProps {
  items: WorkItem[];
  index?: string;
  label?: string;
  className?: string;
}

export function WorkGrid({
  items,
  index = "03",
  label = "Work",
  className,
}: WorkGridProps) {
  const { category, setCategory, filtered } = useWorkFilter(items);

  return (
    <section
      id="work"
      className={cn("border-t border-border py-section md:py-section-lg", className)}
      aria-labelledby="work-heading"
    >
      <Container>
        <SectionHeader
          index={index}
          eyebrow={label}
          title="Things I've built."
          titleId="work-heading"
        />
        <FilterTabs
          tabs={WORK_FILTER_TABS}
          value={category}
          onChange={setCategory}
          aria-label="Filter work by category"
          className="mb-8"
        />
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
                <li key={item.id} data-reveal>
                  <CaseStudyCard
                    title={item.title}
                    categoryLabel={WORK_CATEGORY_LABELS[item.category]}
                    summary={item.summary}
                    href={`/work/${item.slug}`}
                    featured={item.featured}
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
