import { Icon } from "@/components/atoms/Icon";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import { cn } from "@/lib/utils/cn";

export interface SiteFooterProps {
  settings: Pick<SiteSettings, "socials">;
  className?: string;
}

export function SiteFooter({ settings, className }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className={cn(
        "border-t border-border bg-bg px-6 py-10 md:px-10",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <MonoLabel as="p" className="text-muted">
          © {year} Hunain Humail
        </MonoLabel>
        <nav aria-label="Social links">
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {settings.socials.map((social) => (
              <li key={social.href}>
                <Link
                  href={social.href}
                  external
                  className="inline-flex items-center gap-2 text-muted no-underline hover:text-text"
                >
                  <Icon name={social.icon} className="size-5" aria-hidden />
                  <MonoLabel as="span">{social.label}</MonoLabel>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
