"use client";

import { Container } from "@/components/atoms/Container";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { FilterTabs } from "@/components/molecules/FilterTabs";
import { RevealGroup } from "@/components/molecules/RevealGroup";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { WritingItem } from "@/components/molecules/WritingItem";
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
  index?: string;
  label?: string;
  className?: string;
}

function WritingCards({
  items,
  listLabel,
}: {
  items: WritingRecord[];
  listLabel: string;
}) {
  return (
    <ul
      className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2"
      aria-label={listLabel}
    >
      {items.map((item) => (
        <li key={item.id} data-reveal>
          <WritingItem
            dateLabel={formatWritingDate(item.date)}
            typeLabel={WRITING_TYPE_LABELS[item.type]}
            title={item.title}
            venue={item.venue}
            summary={item.summary}
            href={item.url}
          />
        </li>
      ))}
    </ul>
  );
}

function WritingGroups({ groups }: { groups: WritingTypeGroup[] }) {
  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <div key={group.type}>
          <MonoLabel as="p" className="mb-3">
            {group.label}
          </MonoLabel>
          <WritingCards items={group.items} listLabel={group.label} />
        </div>
      ))}
    </div>
  );
}

export function WritingList({
  items,
  index = "04",
  label = "Writing",
  className,
}: WritingListProps) {
  const { type, setType, filtered } = useWritingFilter(items);
  const groups = groupWritingByType(filtered);
  const showGroups = type === "all";

  return (
    <section
      id="writing"
      className={cn("border-t border-border py-section md:py-section-lg", className)}
      aria-labelledby="writing-heading"
    >
      <Container>
        <SectionHeader
          index={index}
          eyebrow={label}
          title="Thinking out loud."
          titleId="writing-heading"
        />
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
        ) : (
          <RevealGroup>
            {showGroups ? (
              <WritingGroups groups={groups} />
            ) : (
              <WritingCards
                items={filtered}
                listLabel="Writing and talks"
              />
            )}
          </RevealGroup>
        )}
      </Container>
    </section>
  );
}
