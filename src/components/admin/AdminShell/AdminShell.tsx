"use client";

import { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils/cn";

export const ADMIN_SECTIONS = [
  "Profile",
  "Story",
  "Now",
  "Work",
  "Writing",
  "Settings/SEO",
  "Messages",
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export interface AdminShellProps {
  onSignOut: () => void;
  className?: string;
}

export function AdminShell({ onSignOut, className }: AdminShellProps) {
  const [section, setSection] = useState<AdminSection>("Profile");

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
              {ADMIN_SECTIONS.map((item) => {
                const selected = item === section;
                return (
                  <li key={item}>
                    <button
                      type="button"
                      aria-current={selected ? "page" : undefined}
                      onClick={() => setSection(item)}
                      className={cn(
                        "w-full rounded-md px-3 py-2 text-left font-mono text-xs uppercase tracking-wide",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                        selected
                          ? "bg-accent text-accent-contrast"
                          : "text-muted hover:text-text",
                      )}
                    >
                      {item}
                    </button>
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
        <main className="flex-1 px-6 py-10 md:px-10">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            Dashboard
          </p>
          <h1 className="font-display text-4xl tracking-tight">{section}</h1>
        </main>
      </div>
    </div>
  );
}
