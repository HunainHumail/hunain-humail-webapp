import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "div";
}

export function VisuallyHidden({
  as = "span",
  className,
  children,
  ...props
}: VisuallyHiddenProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
