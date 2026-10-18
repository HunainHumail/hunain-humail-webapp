"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { FilterTabs } from "@/components/molecules/FilterTabs";
import { WritingItem } from "@/components/molecules/WritingItem";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWritingFilter } from "@/hooks/useWritingFilter";
import type { WritingItem as WritingRecord } from "@/lib/schemas/writing";
import { cn } from "@/lib/utils/cn";
import {
  groupWritingByType,
  WRITING_FILTER_TABS,
  WRITING_TYPE_LABELS,
  type WritingTypeGroup,
} from "@/lib/utils/filterWritingByType";
import { formatWritingDate } from "@/lib/utils/formatWritingDate";

export interface WritingListProps {
  items: WritingRecord[];
  className?: string;
}

function WritingRows({
  items,
  reducedMotion,
  listLabel,
}: {
  items: WritingRecord[];
  reducedMotion: boolean;
  listLabel: string;
}) {
  return (
    <ul
      className="m-0 list-none divide-y divide-border border-y border-border p-0"
      aria-label={listLabel}
    >
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.4,
                  delay: index * 0.06,
                  ease: [0.4, 0, 0.2, 1],
                }
          }
        >
          <WritingItem
            dateLabel={formatWritingDate(item.date)}
            typeLabel={WRITING_TYPE_LABELS[item.type]}
            title={item.title}
            venue={item.venue}
            summary={item.summary}
            href={item.url}
          />
        </motion.li>
      ))}
    </ul>
  );
}

function WritingGroups({
  groups,
  reducedMotion,
}: {
  groups: WritingTypeGroup[];
  reducedMotion: boolean;
}) {
  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <div key={group.type}>
          <MonoLabel as="p" className="mb-2">
            {group.label}
          </MonoLabel>
          <WritingRows
            items={group.items}
            reducedMotion={reducedMotion}
            listLabel={group.label}
          />
        </div>
      ))}
    </div>
  );
}

export function WritingList({ items, className }: WritingListProps) {
  const { type, setType, filtered } = useWritingFilter(items);
  const reducedMotion = useReducedMotion();
  const groups = groupWritingByType(filtered);
  const showGroups = type === "all";

  return (
    <section
      id="writing"
      className={cn("border-t border-border py-16 md:py-20", className)}
      aria-labelledby="writing-section-label"
    >
      <Container>
        <MonoLabel id="writing-section-label" as="p" className="mb-2">
          04 · Writing & talks
        </MonoLabel>
        <Heading level={2} className="mb-6">
          Thinking out loud.
        </Heading>
        <FilterTabs
          tabs={WRITING_FILTER_TABS}
          value={type}
          onChange={setType}
          aria-label="Filter writing by type"
          className="mb-8"
        />
        <p className="sr-only" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </p>
        {filtered.length === 0 ? (
          <Text variant="muted">No writing in this type.</Text>
        ) : showGroups ? (
          <WritingGroups groups={groups} reducedMotion={reducedMotion} />
        ) : (
          <WritingRows
            items={filtered}
            reducedMotion={reducedMotion}
            listLabel="Writing and talks"
          />
        )}
      </Container>
    </section>
  );
}
