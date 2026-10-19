"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Icon } from "@/components/atoms/Icon";
import { Link } from "@/components/atoms/Link";
import { DubaiClock } from "@/components/molecules/DubaiClock";
import { NavItem } from "@/components/molecules/NavItem";
import { ProfileAvatar } from "@/components/molecules/ProfileAvatar";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useXlViewport } from "@/hooks/useXlViewport";
import type { ProfileAvatarItem } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import { cn } from "@/lib/utils/cn";

export interface SiteHeaderProps {
  settings: Pick<SiteSettings, "nav" | "seo">;
  avatars?: readonly ProfileAvatarItem[];
  className?: string;
}

function brandFromTitle(title: string): string {
  return title.trim().split(/\s+/)[0]?.toLowerCase() ?? title;
}

export function SiteHeader({ settings, avatars = [], className }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const hrefs = useMemo(
    () => settings.nav.map((item) => item.href),
    [settings.nav],
  );
  const activeHref = useActiveSection(hrefs);
  const brand = brandFromTitle(settings.seo.title);
  const headerClock = useXlViewport();

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-sticky border-b border-border bg-bg/95 backdrop-blur-sm",
        className,
      )}
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-text no-underline"
          aria-label="Hunain Humail home"
        >
          {avatars.length > 0 ? (
            <ProfileAvatar images={avatars} size="sm" />
          ) : null}
          <span>
            {brand}
            <span className="text-accent">.</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Primary"
        >
          {settings.nav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              active={activeHref === item.href}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {headerClock ? <DubaiClock /> : null}
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
            <Icon name={menuOpen ? "x" : "menu"} className="size-5" aria-hidden />
          </Button>
        </div>
      </Container>

      <nav
        id={menuId}
        hidden={!menuOpen}
        className="border-t border-border lg:hidden"
        aria-label="Mobile primary"
      >
        <Container className="flex flex-col gap-5 py-6">
          <ul className="m-0 flex list-none flex-col gap-5 p-0">
            {settings.nav.map((item) => (
              <li key={item.href}>
                <NavItem
                  item={item}
                  active={activeHref === item.href}
                  onNavigate={closeMenu}
                />
              </li>
            ))}
          </ul>
          {headerClock ? null : <DubaiClock />}
        </Container>
      </nav>
    </header>
  );
}
