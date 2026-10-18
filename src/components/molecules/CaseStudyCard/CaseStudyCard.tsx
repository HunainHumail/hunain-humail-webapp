import Image from "next/image";
import { Badge } from "@/components/atoms/Badge";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/utils/cn";
import { imageUnoptimized } from "@/lib/utils/imageUnoptimized";

export interface CaseStudyCardProps {
  title: string;
  categoryLabel: string;
  summary: string;
  href: string;
  featured?: boolean;
  coverUrl?: string;
  coverAlt?: string;
  priority?: boolean;
  className?: string;
}

export function CaseStudyCard({
  title,
  categoryLabel,
  summary,
  href,
  featured = false,
  coverUrl,
  coverAlt,
  priority = false,
  className,
}: CaseStudyCardProps) {
  return (
    <article
      className={cn(
        "card-lift h-full overflow-hidden rounded-xl border border-border bg-surface",
        className,
      )}
    >
      <Link href={href} className="flex h-full flex-col no-underline text-inherit">
        {coverUrl ? (
          <div className="relative aspect-cover overflow-hidden bg-elevated">
            <Image
              src={coverUrl}
              alt={coverAlt ?? `${title} cover`}
              fill
              sizes={
                featured
                  ? "(min-width: 640px) 80vw, 100vw"
                  : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className="object-cover"
              unoptimized={imageUnoptimized()}
              priority={priority}
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <MonoLabel>{categoryLabel}</MonoLabel>
            {featured ? <Badge status="success">Featured</Badge> : null}
          </div>
          <Heading level={3} className={featured ? "text-2xl" : "text-xl"}>
            {title}
          </Heading>
          <Text variant="muted" className="mt-2 text-sm">
            {summary}
          </Text>
        </div>
      </Link>
    </article>
  );
}
