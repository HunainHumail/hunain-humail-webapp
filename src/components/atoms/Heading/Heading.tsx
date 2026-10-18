import { createElement, forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "default" | "display" | "hero" | "section";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  size?: HeadingSize;
}

const levelChrome: Record<HeadingLevel, string> = {
  1: "font-display font-semibold tracking-tight",
  2: "font-display font-semibold tracking-tight",
  3: "font-display font-semibold tracking-tight",
  4: "font-display font-medium",
  5: "font-sans font-medium",
  6: "font-sans font-medium",
};

const levelSize: Record<HeadingLevel, string> = {
  1: "text-4xl",
  2: "text-display-section",
  3: "text-2xl",
  4: "text-xl",
  5: "text-lg",
  6: "text-base",
};

const sizeClasses: Record<HeadingSize, string | undefined> = {
  default: undefined,
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
        className: cn(
          levelChrome[level],
          sizeClasses[size] ?? levelSize[level],
          className,
        ),
        ...props,
      },
      children,
    );
  },
);
