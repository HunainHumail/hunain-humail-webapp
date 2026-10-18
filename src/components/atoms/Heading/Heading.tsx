import { createElement, forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "default" | "display" | "hero" | "section";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  size?: HeadingSize;
}

const levelClasses: Record<HeadingLevel, string> = {
  1: "text-4xl font-display font-semibold tracking-tight",
  2: "text-display-section font-display font-semibold tracking-tight",
  3: "text-2xl font-display font-semibold tracking-tight",
  4: "text-xl font-display font-medium",
  5: "text-lg font-sans font-medium",
  6: "text-base font-sans font-medium",
};

const sizeClasses: Record<HeadingSize, string | false> = {
  default: false,
  display: "text-display-hero tracking-tighter",
  hero: "text-display-hero tracking-tighter",
  section: "text-display-section tracking-tight",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    { level, size = "default", className, children, ...props },
    ref,
  ) {
    return createElement(
      `h${level}`,
      {
        ref,
        className: cn(levelClasses[level], sizeClasses[size], className),
        ...props,
      },
      children,
    );
  },
);
