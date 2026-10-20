"use client";

import Link from "next/link";
import { Input } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { useBlueprintLeads } from "@/hooks/useBlueprintLeads";
import { cn } from "@/lib/utils/cn";

export interface BlueprintLeadsPanelProps {
  className?: string;
}

function formatCreated(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}

export function BlueprintLeadsPanel({ className }: BlueprintLeadsPanelProps) {
  const { filtered, loading, error, filters, setFilters } = useBlueprintLeads();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-muted">
          Admin
        </p>
        <h1 className="font-display text-4xl tracking-tight">Blueprints</h1>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="bp-status" className="text-sm text-muted">
            Status
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                status: value as typeof filters.status,
              })
            }
          >
            <SelectTrigger id="bp-status" className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bp-from" className="text-sm text-muted">
            From
          </label>
          <Input
            id="bp-from"
            type="date"
            value={filters.from ?? ""}
            onChange={(event) =>
              setFilters({
                ...filters,
                from: event.target.value || undefined,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bp-to" className="text-sm text-muted">
            To
          </label>
          <Input
            id="bp-to"
            type="date"
            value={filters.to ?? ""}
            onChange={(event) =>
              setFilters({
                ...filters,
                to: event.target.value || undefined,
              })
            }
          />
        </div>
      </div>

      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">Loading</p> : null}
      {!loading && filtered.length === 0 ? (
        <p className="text-muted">
          No blueprint leads yet. Leads appear when visitors use the Blueprint
          your idea section on the home page.
        </p>
      ) : null}

      {filtered.length > 0 ? (
        <Table>
          <caption className="sr-only">Blueprint leads</caption>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>App</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Generation</TableHead>
              <TableHead>Lead status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.spec?.appName ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs uppercase tracking-wide">
                  {item.platform}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs uppercase tracking-wide">
                    {item.generationStatus}
                  </span>
                  {item.errorCode ? (
                    <span className="ml-2 font-mono text-xs text-muted">
                      {item.errorCode}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <time dateTime={item.createdAt}>
                    {formatCreated(item.createdAt)}
                  </time>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/blueprints?id=${item.id}`}
                    className="font-mono text-xs uppercase tracking-wide text-accent"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}
