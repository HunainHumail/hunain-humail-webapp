import { cn } from "@/lib/utils/cn";
import { ImportSeedButton } from "../ImportSeedButton";

export interface AdminDashboardProps {
  className?: string;
}

export function AdminDashboard({ className }: AdminDashboardProps) {
  return (
    <div className={cn("flex max-w-xl flex-col gap-6", className)}>
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
    </div>
  );
}
