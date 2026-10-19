"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils/cn";

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Profile", href: "/admin/profile" },
  { label: "Story", href: "/admin/story" },
  { label: "Now", href: "/admin/now" },
  { label: "Work", href: "/admin/work" },
  { label: "Writing", href: "/admin/writing" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Settings/SEO", href: "/admin/settings" },
  { label: "Messages", href: "/admin/messages" },
] as const;

export type AdminNavItem = (typeof ADMIN_NAV)[number];

export interface AdminShellProps {
  pathname: string;
  onSignOut: () => void;
  children?: ReactNode;
  className?: string;
}

function isCurrent(href: string, pathname: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  pathname,
  onSignOut,
  children,
  className,
}: AdminShellProps) {
  return (
    <div className={cn("min-h-screen bg-grid text-text", className)}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row">
        <aside className="border-b border-border bg-surface md:w-64 md:border-b-0 md:border-r">
          <div className="px-6 py-6">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              Admin
            </p>
            <p className="font-display text-2xl tracking-tight">
              Hunain
              <span className="text-accent">.</span>
            </p>
          </div>
          <nav aria-label="Admin">
            <ul className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-col md:px-3">
              {ADMIN_NAV.map((item) => {
                const selected = isCurrent(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={selected ? "page" : undefined}
                      className={cn(
                        "block w-full rounded-md px-3 py-2 text-left font-mono text-xs uppercase tracking-wide",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                        selected
                          ? "bg-accent text-accent-contrast"
                          : "text-muted hover:text-text",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="px-4 py-4">
            <Button type="button" variant="outline" onClick={onSignOut}>
              Sign out
            </Button>
          </div>
        </aside>
        <main className="flex-1 px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
