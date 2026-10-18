import { createElement, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "default" | "display";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  size?: HeadingSize;
}

const levelClasses: Record<HeadingLevel, string> = {
  1: "text-4xl font-display font-semibold tracking-tight",
  2: "text-3xl font-display font-semibold tracking-tight",
  3: "text-2xl font-display font-semibold tracking-tight",
  4: "text-xl font-display font-medium",
  5: "text-lg font-sans font-medium",
  6: "text-base font-sans font-medium",
};

export function Heading({
  level,
  size = "default",
  className,
  children,
  ...props
}: HeadingProps) {
  return createElement(
    `h${level}`,
    {
      className: cn(
        levelClasses[level],
        size === "display" && "text-display-xl tracking-tight",
        className,
      ),
      ...props,
    },
    children,
  );
}
