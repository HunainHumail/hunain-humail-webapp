import { Container } from "@/components/atoms/Container";
import { Icon } from "@/components/atoms/Icon";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import { cn } from "@/lib/utils/cn";

export interface SiteFooterProps {
  settings: Pick<SiteSettings, "socials" | "seo">;
  className?: string;
}

export function SiteFooter({ settings, className }: SiteFooterProps) {
  return (
    <footer
      role="contentinfo"
      className={cn("border-t border-border bg-bg py-10", className)}
    >
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <MonoLabel as="p" className="text-muted">
          {settings.seo.title}
        </MonoLabel>
        <nav aria-label="Social links">
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {settings.socials.map((social) => (
              <li key={social.href}>
                <Link
                  href={social.href}
                  external
                  className="inline-flex items-center gap-2 text-muted no-underline hover:text-accent"
                >
                  <Icon name={social.icon} className="size-5" aria-hidden />
                  <MonoLabel as="span">{social.label}</MonoLabel>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
