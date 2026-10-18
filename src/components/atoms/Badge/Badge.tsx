import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeStatus = "default" | "success" | "warning" | "error";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
}

const statusClasses: Record<BadgeStatus, string> = {
  default: "bg-elevated text-text border-border",
  success: "bg-accent/15 text-accent border-accent/30",
  warning: "bg-elevated text-muted border-border",
  error: "bg-elevated text-text border-border",
};

export function Badge({
  status = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-xs uppercase tracking-wide",
        statusClasses[status],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
