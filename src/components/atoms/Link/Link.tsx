import NextLink from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  children: ReactNode;
}

const linkClasses =
  "text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-sm";

export function Link({
  href,
  external,
  className,
  children,
  ...props
}: LinkProps) {
  const isExternal =
    external ?? (href.startsWith("http://") || href.startsWith("https://"));

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(linkClasses, className)}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={cn(linkClasses, className)} {...props}>
      {children}
    </NextLink>
  );
}
