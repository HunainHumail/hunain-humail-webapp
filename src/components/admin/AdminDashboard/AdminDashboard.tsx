import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { HealthFailureBanner } from "../HealthFailureBanner";
import { ImportSeedButton } from "../ImportSeedButton";

export interface AdminDashboardProps {
  className?: string;
}

export function AdminDashboard({ className }: AdminDashboardProps) {
  return (
    <div className={cn("flex max-w-xl flex-col gap-6", className)}>
      <HealthFailureBanner />
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-muted">
          Admin
        </p>
        <h1 className="font-display text-4xl tracking-tight">Dashboard</h1>
        <p className="mt-3 text-muted">
          Populate Firestore with the built-in site content, then edit each
          section.
        </p>
      </div>
      <ImportSeedButton />
      <Link
        href="/admin/blueprints"
        className="rounded-md border border-border bg-surface p-4 no-underline transition-colors hover:bg-elevated"
      >
        <p className="font-mono text-xs uppercase tracking-wide text-muted">
          Leads
        </p>
        <p className="font-display text-xl tracking-tight text-text">
          Blueprints
        </p>
        <p className="mt-2 text-sm text-muted">
          Review email-gated app ideas and generated wireframe specs.
        </p>
      </Link>
    </div>
  );
}
