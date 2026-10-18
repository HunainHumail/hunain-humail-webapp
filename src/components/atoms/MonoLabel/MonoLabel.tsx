import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface MonoLabelProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "p" | "label";
}

export function MonoLabel({
  as = "span",
  className,
  children,
  ...props
}: MonoLabelProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "font-mono text-xs uppercase tracking-wide text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
