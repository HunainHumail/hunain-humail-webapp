"use client";

import { MonoLabel } from "@/components/atoms/MonoLabel";
import { useDubaiClock } from "@/hooks/useDubaiClock";
import { cn } from "@/lib/utils/cn";

export interface DubaiClockProps {
  className?: string;
}

export function DubaiClock({ className }: DubaiClockProps) {
  const label = useDubaiClock();

  return (
    <MonoLabel
      as="span"
      className={cn("whitespace-nowrap tabular-nums", className)}
      aria-live="off"
    >
      {label}
    </MonoLabel>
  );
}
