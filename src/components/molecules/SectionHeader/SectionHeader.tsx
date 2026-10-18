"use client";

import { useRef } from "react";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { SectionCounter } from "@/components/atoms/SectionCounter";
import { useGsapLineReveal } from "@/hooks/useGsapLineReveal";
import { cn } from "@/lib/utils/cn";

export interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title?: string;
  titleId: string;
  className?: string;
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  titleId,
  className,
}: SectionHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useGsapLineReveal(titleRef);

  const headingText = title ?? eyebrow;

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-8",
        className,
      )}
    >
      <SectionCounter value={index} />
      <div className="min-w-0">
        {title ? (
          <MonoLabel as="p" className="mb-2">
            {eyebrow}
          </MonoLabel>
        ) : null}
        <Heading ref={titleRef} id={titleId} level={2} size="section">
          <span className="block overflow-hidden">
            <span data-reveal-line className="inline-block">
              {headingText}
            </span>
          </span>
        </Heading>
      </div>
    </div>
  );
}
