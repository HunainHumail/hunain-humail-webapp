import Image from "next/image";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/utils/cn";
import { imageUnoptimized } from "@/lib/utils/imageUnoptimized";

export interface WritingItemProps {
  dateLabel: string;
  typeLabel: string;
  title: string;
  venue?: string;
  summary?: string;
  href?: string;
  ctaLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

function WritingItemBody({
  dateLabel,
  typeLabel,
  title,
  venue,
  summary,
  ctaLabel,
  imageSrc,
  imageAlt,
  showArrow,
}: {
  dateLabel: string;
  typeLabel: string;
  title: string;
  venue?: string;
  summary?: string;
  ctaLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  showArrow: boolean;
}) {
  return (
    <>
      {imageSrc ? (
        <div className="relative aspect-video overflow-hidden bg-elevated">
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            unoptimized={imageUnoptimized()}
          />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 items-start gap-4 p-5">
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
          {venue ? (
            <Text variant="muted" className="text-sm">
              {venue}
            </Text>
          ) : null}
          {summary ? (
            <Text variant="muted" className="text-sm">
              {summary}
            </Text>
          ) : null}
          {ctaLabel ? (
            <Text as="span" className="text-sm text-accent">
              {ctaLabel}
            </Text>
          ) : null}
        </div>
        {showArrow ? (
          <Icon
            name="arrow"
            className="size-5 shrink-0 text-muted transition-transform duration-fast ease-default group-hover:text-accent motion-safe:group-hover:translate-x-1"
          />
        ) : null}
      </div>
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
  ctaLabel,
  imageSrc,
  imageAlt,
  className,
}: WritingItemProps) {
  const body = (
    <WritingItemBody
      dateLabel={dateLabel}
      typeLabel={typeLabel}
      title={title}
      venue={venue}
      summary={summary}
      ctaLabel={ctaLabel}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      showArrow={Boolean(href)}
    />
  );

  const surfaceClassName = cn(
    "card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-inherit no-underline",
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
