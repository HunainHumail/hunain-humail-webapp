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
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
        <MonoLabel className="shrink-0 sm:w-44">
          {dateLabel} · {typeLabel}
        </MonoLabel>
        <div className="min-w-0 flex-1">
          <Heading
            level={3}
            className="text-xl transition-colors duration-fast ease-default group-hover:text-accent"
          >
            {title}
          </Heading>
          <Text variant="muted" className="mt-1 text-sm">
            {venue}
          </Text>
          <Text variant="muted" className="mt-1 text-sm">
            {summary}
          </Text>
        </div>
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
  const rowClassName = cn(
    "group flex w-full items-center gap-4 py-5 text-inherit no-underline",
    className,
  );

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

  if (href) {
    return (
      <article>
        <Link href={href} className={rowClassName}>
          {body}
        </Link>
      </article>
    );
  }

  return <article className={rowClassName}>{body}</article>;
}
