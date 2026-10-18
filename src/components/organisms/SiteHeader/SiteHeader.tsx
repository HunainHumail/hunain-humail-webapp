"use client";

import { useCallback, useId, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Link } from "@/components/atoms/Link";
import { DubaiClock } from "@/components/molecules/DubaiClock";
import { NavItem } from "@/components/molecules/NavItem";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import { cn } from "@/lib/utils/cn";

export interface SiteHeaderProps {
  settings: Pick<SiteSettings, "nav">;
  className?: string;
}

export function SiteHeader({ settings, className }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={cn(
        "sticky top-0 z-sticky border-b border-border bg-bg/95 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-text no-underline"
          aria-label="Hunain Humail home"
        >
          HH
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Primary"
        >
          {settings.nav.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <DubaiClock className="hidden xl:inline" />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-2.5"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "x" : "arrow"} className="size-5" aria-hidden />
          </Button>
        </div>
      </div>

      <nav
        id={menuId}
        hidden={!menuOpen}
        className="border-t border-border px-6 py-4 lg:hidden"
        aria-label="Mobile primary"
      >
        <ul className="flex flex-col gap-4">
          {settings.nav.map((item) => (
            <li key={item.href}>
              <NavItem item={item} onNavigate={closeMenu} />
            </li>
          ))}
          <li>
            <DubaiClock />
          </li>
        </ul>
      </nav>
    </header>
  );
}
