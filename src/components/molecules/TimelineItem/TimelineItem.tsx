import { Chip } from "@/components/atoms/Chip";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { cn } from "@/lib/utils/cn";

export interface TimelineItemProps {
  indexLabel: string;
  year: string;
  title: string;
  body: string;
  tags: string[];
  className?: string;
}

export function TimelineItem({
  indexLabel,
  year,
  title,
  body,
  tags,
  className,
}: TimelineItemProps) {
  return (
    <article
      data-timeline-item
      className={cn("relative pb-10 last:pb-0", className)}
    >
      <span
        aria-hidden
        className="absolute -left-[1.625rem] top-2 size-2 rounded-full bg-accent"
      />
      <MonoLabel className="mb-2 block">{indexLabel}</MonoLabel>
      <p
        className={cn(
          "font-display text-4xl font-semibold tracking-tight text-transparent md:text-5xl",
          "[-webkit-text-stroke-width:1px] [-webkit-text-stroke-color:var(--color-text)]",
        )}
        aria-hidden
      >
        {year}
      </p>
      <VisuallyHidden>{year}</VisuallyHidden>
      <Heading level={3} className="mt-2 text-xl md:text-2xl">
        {title}
      </Heading>
      <Text variant="muted" className="mt-2 max-w-prose">
        {body}
      </Text>
      {tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
          {tags.map((tag) => (
            <li key={tag}>
              <Chip>{tag}</Chip>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
