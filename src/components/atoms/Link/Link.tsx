import NextLink from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { resolveExternalHref } from "@/lib/utils/resolveExternalHref";
import { rewriteLinkedInUrls } from "@/lib/utils/rewriteLinkedInUrls";

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
  const externalHref = resolveExternalHref(rewriteLinkedInUrls(href));
  const isExternal = external ?? externalHref !== null;

  if (isExternal) {
    return (
      <a
        {...props}
        href={externalHref ?? href}
        className={cn(linkClasses, className)}
        target="_blank"
        rel="noopener noreferrer"
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
