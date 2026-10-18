import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ChipProps = HTMLAttributes<HTMLSpanElement>;

export function Chip({ className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm text-text",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
