import { Container } from "@/components/atoms/Container";
import { Text } from "@/components/atoms/Text";
import { NowCard } from "@/components/molecules/NowCard";
import { RevealGroup } from "@/components/molecules/RevealGroup";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import type { NowItem } from "@/lib/schemas/now";
import {
  formatUpdatedMonthYear,
  latestUpdatedAtIso,
} from "@/lib/utils/formatUpdatedMonthYear";
import { cn } from "@/lib/utils/cn";

export interface NowSectionProps {
  items: NowItem[];
  index?: string;
  label?: string;
  className?: string;
}

export function NowSection({
  items,
  index = "02",
  label = "Now",
  className,
}: NowSectionProps) {
  const updatedLabel = formatUpdatedMonthYear(latestUpdatedAtIso(items));

  return (
    <section
      id="now"
      className={cn("border-t border-border py-section md:py-section-lg", className)}
      aria-labelledby="now-heading"
    >
      <Container>
        <SectionHeader
          index={index}
          eyebrow={label}
          title="This month."
          titleId="now-heading"
        />
        <Text variant="muted" className="mb-8 text-sm">
          {updatedLabel}
        </Text>
        <RevealGroup>
          <ul
            className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Current focus"
          >
            {items.map((item) => (
              <li key={item.id} data-reveal>
                <NowCard label={item.label} title={item.title} body={item.body} />
              </li>
            ))}
          </ul>
        </RevealGroup>
      </Container>
    </section>
  );
}
