"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/atoms/Badge";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

export interface CaseStudyCardProps {
  title: string;
  categoryLabel: string;
  summary: string;
  href: string;
  featured?: boolean;
  className?: string;
}

export function CaseStudyCard({
  title,
  categoryLabel,
  summary,
  href,
  featured = false,
  className,
}: CaseStudyCardProps) {
  const reducedMotion = useReducedMotion();

  const motionProps = reducedMotion
    ? {}
    : {
        whileHover: { y: -4 },
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.article
      className={cn(
        "h-full rounded-xl border border-border bg-surface p-5 transition-colors duration-fast ease-default",
        "hover:border-accent",
        className,
      )}
      {...motionProps}
    >
      <Link href={href} className="flex h-full flex-col no-underline text-inherit">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <MonoLabel>{categoryLabel}</MonoLabel>
          {featured ? <Badge status="success">Featured</Badge> : null}
        </div>
        <Heading level={3} className="text-xl">
          {title}
        </Heading>
        <Text variant="muted" className="mt-2 text-sm">
          {summary}
        </Text>
      </Link>
    </motion.article>
  );
}
