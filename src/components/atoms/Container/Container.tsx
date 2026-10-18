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
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
