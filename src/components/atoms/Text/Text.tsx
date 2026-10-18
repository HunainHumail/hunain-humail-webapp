import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type TextVariant = "body" | "muted" | "small";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  as?: "p" | "span" | "div";
}

const variantClasses: Record<TextVariant, string> = {
  body: "text-base text-text",
  muted: "text-base text-muted",
  small: "text-sm text-muted",
};

export function Text({
  variant = "body",
  as = "p",
  className,
  children,
  ...props
}: TextProps) {
  const Component = as;
  return (
    <Component className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Component>
  );
}
