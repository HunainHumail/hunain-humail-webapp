"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { healthFailureBannerLabel } from "@/lib/health/summarizeHealthEvents";
import { useHealthFailureCount } from "@/hooks/useHealthFailureCount";

export interface HealthFailureBannerProps {
  className?: string;
}

export function HealthFailureBanner({ className }: HealthFailureBannerProps) {
  const count = useHealthFailureCount();
  if (count <= 0) {
    return null;
  }

  return (
    <Link
      href="/admin/health"
      className={cn(
        "block rounded-md bg-danger px-4 py-3 font-medium text-danger-contrast no-underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        className,
      )}
    >
      {healthFailureBannerLabel(count)}
    </Link>
  );
}
