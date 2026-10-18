import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "main";
}

export function Container({
  as = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "mx-auto w-full min-w-0 max-w-page px-gutter",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
