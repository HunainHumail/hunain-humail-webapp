"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { CaseStudyCard } from "@/components/molecules/CaseStudyCard";
import { FilterTabs } from "@/components/molecules/FilterTabs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWorkFilter } from "@/hooks/useWorkFilter";
import type { WorkItem } from "@/lib/schemas/work";
import { cn } from "@/lib/utils/cn";
import {
  WORK_CATEGORY_LABELS,
  WORK_FILTER_TABS,
} from "@/lib/utils/filterWorkByCategory";

export interface WorkGridProps {
  items: WorkItem[];
  className?: string;
}

export function WorkGrid({ items, className }: WorkGridProps) {
  const { category, setCategory, filtered } = useWorkFilter(items);
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="work"
      className={cn("border-t border-border py-16 md:py-20", className)}
      aria-labelledby="work-section-label"
    >
      <Container>
        <MonoLabel id="work-section-label" as="p" className="mb-2">
          03 · Work
        </MonoLabel>
        <Heading level={2} className="mb-6">
          Things I&apos;ve built.
        </Heading>
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
          <ul
            className="grid list-none gap-4 p-0 m-0 sm:grid-cols-2"
            aria-label="Case studies"
          >
            {filtered.map((item, index) => (
              <motion.li
                key={item.id}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.4,
                        delay: index * 0.08,
                        ease: [0.4, 0, 0.2, 1],
                      }
                }
              >
                <CaseStudyCard
                  title={item.title}
                  categoryLabel={WORK_CATEGORY_LABELS[item.category]}
                  summary={item.summary}
                  href={`/work/${item.slug}`}
                  featured={item.featured}
                />
              </motion.li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
