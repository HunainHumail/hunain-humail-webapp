import { Link } from "@/components/atoms/Link";
import { ScrollProgressBar } from "@/components/molecules/ScrollProgressBar";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { SmoothScrollProvider } from "@/components/organisms/SmoothScrollProvider";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import { cn } from "@/lib/utils/cn";
import { type ReactNode } from "react";

export interface SiteTemplateProps {
  settings: SiteSettings;
  children: ReactNode;
  className?: string;
}

export function SiteTemplate({
  settings,
  children,
  className,
}: SiteTemplateProps) {
  return (
    <SmoothScrollProvider>
      <div className={cn("flex min-h-full flex-col bg-grid", className)}>
        <Link
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-text focus:ring-2 focus:ring-focus-ring"
        >
          Skip to content
        </Link>
        <ScrollProgressBar />
        <SiteHeader settings={settings} />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter settings={settings} />
      </div>
    </SmoothScrollProvider>
  );
}
