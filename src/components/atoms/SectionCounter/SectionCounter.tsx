import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionCounterProps extends HTMLAttributes<HTMLSpanElement> {
  value: string;
}

export function SectionCounter({
  value,
  className,
  ...props
}: SectionCounterProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "font-display text-display-counter font-semibold tracking-tighter counter-stroke select-none",
        className,
      )}
      {...props}
    >
      {value}
    </span>
  );
}
