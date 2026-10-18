import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/utils/cn";

export interface WritingItemProps {
  dateLabel: string;
  typeLabel: string;
  title: string;
  venue: string;
  summary: string;
  href?: string;
  className?: string;
}

function WritingItemBody({
  dateLabel,
  typeLabel,
  title,
  venue,
  summary,
  showArrow,
}: {
  dateLabel: string;
  typeLabel: string;
  title: string;
  venue: string;
  summary: string;
  showArrow: boolean;
}) {
  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <MonoLabel className="shrink-0">
          {dateLabel} · {typeLabel}
        </MonoLabel>
        <Heading
          level={3}
          className="text-xl transition-colors duration-fast ease-default group-hover:text-accent"
        >
          {title}
        </Heading>
        <Text variant="muted" className="text-sm">
          {venue}
        </Text>
        <Text variant="muted" className="text-sm">
          {summary}
        </Text>
      </div>
      {showArrow ? (
        <Icon
          name="arrow"
          className="size-5 shrink-0 text-muted transition-transform duration-fast ease-default group-hover:text-accent motion-safe:group-hover:translate-x-1"
        />
      ) : null}
    </>
  );
}

export function WritingItem({
  dateLabel,
  typeLabel,
  title,
  venue,
  summary,
  href,
  className,
}: WritingItemProps) {
  const body = (
    <WritingItemBody
      dateLabel={dateLabel}
      typeLabel={typeLabel}
      title={title}
      venue={venue}
      summary={summary}
      showArrow={Boolean(href)}
    />
  );

  const surfaceClassName = cn(
    "card-lift group flex h-full items-start gap-4 rounded-xl border border-border bg-surface p-5 text-inherit no-underline",
    className,
  );

  if (href) {
    return (
      <article className="h-full">
        <Link href={href} className={surfaceClassName}>
          {body}
        </Link>
      </article>
    );
  }

  return <article className={surfaceClassName}>{body}</article>;
}
