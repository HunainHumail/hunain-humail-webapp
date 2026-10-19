import { Badge } from "@/components/atoms/Badge";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/utils/cn";

export interface TestimonialCardProps {
  name: string;
  role: string;
  sourceLabel: string;
  text: string;
  dateLabel: string;
  dateTime: string;
  rating?: number;
  avatarUrl?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <p
      className="m-0 font-mono text-sm tracking-wide"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={index < rating ? "text-accent" : "text-muted"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </p>
  );
}

export function TestimonialCard({
  name,
  role,
  sourceLabel,
  text,
  dateLabel,
  dateTime,
  rating,
  avatarUrl,
  href,
  linkLabel,
  className,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "card-lift flex h-full flex-col gap-4 rounded-xl border border-border bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge>{sourceLabel}</Badge>
        {rating !== undefined ? <StarRating rating={rating} /> : null}
      </div>
      <blockquote className="m-0">
        <Text className="text-sm">{text}</Text>
      </blockquote>
      <div className="mt-auto flex items-center gap-3">
        {avatarUrl ? (
          // CMS avatars are not limited to next/image remote hosts.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="size-avatar-sm rounded-full border border-border object-cover"
          />
        ) : null}
        <div className="min-w-0">
          <Heading level={3} className="text-lg">
            {name}
          </Heading>
          <Text variant="muted" className="text-sm">
            {role}
          </Text>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <time
          className="font-mono text-xs uppercase tracking-wide text-muted"
          dateTime={dateTime}
        >
          {dateLabel}
        </time>
        {href && linkLabel ? (
          <Link href={href} className="font-mono text-xs uppercase tracking-wide">
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
