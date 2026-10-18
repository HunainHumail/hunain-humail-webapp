import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { NowCard } from "@/components/molecules/NowCard";
import type { NowItem } from "@/lib/schemas/now";
import {
  formatUpdatedMonthYear,
  latestUpdatedAtIso,
} from "@/lib/utils/formatUpdatedMonthYear";
import { cn } from "@/lib/utils/cn";

export interface NowSectionProps {
  items: NowItem[];
  className?: string;
}

export function NowSection({ items, className }: NowSectionProps) {
  const updatedLabel = formatUpdatedMonthYear(latestUpdatedAtIso(items));

  return (
    <section
      id="now"
      className={cn("border-t border-border py-16 md:py-20", className)}
      aria-labelledby="now-section-label"
    >
      <Container>
        <MonoLabel id="now-section-label" as="p" className="mb-2">
          02 · Now
        </MonoLabel>
        <Heading level={2} className="mb-2">
          This month.
        </Heading>
        <Text variant="muted" className="mb-8 text-sm">
          {updatedLabel}
        </Text>
        <ul
          className="grid list-none gap-4 p-0 m-0 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Current focus"
        >
          {items.map((item) => (
            <li key={item.id}>
              <NowCard label={item.label} title={item.title} body={item.body} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
