"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils/cn";

export interface ScrollProgressBarProps {
  className?: string;
}

export function ScrollProgressBar({ className }: ScrollProgressBarProps) {
  const progress = useScrollProgress();

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-sticky h-0.5 bg-transparent",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Page scroll progress"
    >
      <div
        className="h-full bg-accent transition-[width] duration-fast ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
