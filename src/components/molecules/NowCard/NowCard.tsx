"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

export interface NowCardProps {
  label: string;
  title: string;
  body: string;
  className?: string;
}

export function NowCard({ label, title, body, className }: NowCardProps) {
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
        "rounded-xl border border-border bg-surface p-5 transition-colors duration-fast ease-default",
        "hover:border-accent",
        className,
      )}
      {...motionProps}
    >
      <MonoLabel className="mb-2 block">{label}</MonoLabel>
      <Heading level={3} className="text-xl">
        {title}
      </Heading>
      <Text variant="muted" className="mt-2 text-sm">
        {body}
      </Text>
    </motion.article>
  );
}
