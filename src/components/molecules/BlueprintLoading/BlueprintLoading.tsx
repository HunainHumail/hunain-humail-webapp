"use client";

import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { FRAME } from "@/lib/blueprint/layoutBlocks";
import type { BlueprintPlatform } from "@/lib/schemas/blueprint";
import { cn } from "@/lib/utils/cn";

export interface BlueprintLoadingProps {
  platform: BlueprintPlatform;
  label: string;
  className?: string;
}

export function BlueprintLoading({
  platform,
  label,
  className,
}: BlueprintLoadingProps) {
  const frame = FRAME[platform];
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-wrap items-start gap-4", className)}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "relative min-w-0 max-w-full overflow-hidden rounded-md bg-grid",
            platform === "web" ? "w-wireframe-web" : "w-wireframe",
          )}
          style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
        >
          <div
            className="absolute inset-x-0 top-0 h-0.5 bg-blueprint-line motion-safe:animate-pulse motion-reduce:animate-none"
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
}
