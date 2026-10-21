"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { useHealthEvents } from "@/hooks/useHealthEvents";
import { HEALTH_TIME_LABEL, formatHealthTime } from "@/lib/health/formatHealthTime";
import {
  filterHealthEvents,
  summarizeHealthEvents,
  type HealthRange,
} from "@/lib/health/summarizeHealthEvents";
import type { HealthEvent } from "@/lib/schemas/healthEvent";
import { cn } from "@/lib/utils/cn";

export interface HealthPanelProps {
  className?: string;
}

const RANGES: { id: HealthRange; label: string }[] = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
];

function detail(value: string | undefined): string {
  return value && value.length > 0 ? value : "—";
}

export function HealthPanel({ className }: HealthPanelProps) {
  const { items, loading, error } = useHealthEvents();
  const [range, setRange] = useState<HealthRange>("7d");
  const [now, setNow] = useState<number | null>(null);
  const visible = useMemo(() => {
    if (now === null) {
      return items;
    }
    return filterHealthEvents(items, range, now);
  }, [items, range, now]);
  const summary = useMemo(() => summarizeHealthEvents(visible), [visible]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-muted">
          Admin
        </p>
        <h1 className="font-display text-4xl tracking-tight">Health</h1>
        <p className="mt-3 text-muted">
          Blueprint failures from the last 7 days. Times are {HEALTH_TIME_LABEL}.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Time range">
        {RANGES.map((item) => {
          const selected = range === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setRange(item.id);
                setNow(Date.now());
              }}
              className={cn(
                "rounded-md px-3 py-2 font-mono text-xs uppercase tracking-wide",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                selected
                  ? "bg-accent text-accent-contrast"
                  : "border border-border text-muted",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <section aria-label="Counts by source" className="flex flex-wrap gap-6">
        <p>
          <span className="font-mono text-xs uppercase tracking-wide text-muted">
            Client
          </span>{" "}
          {summary.bySource.client}
        </p>
        <p>
          <span className="font-mono text-xs uppercase tracking-wide text-muted">
            Server
          </span>{" "}
          {summary.bySource.server}
        </p>
      </section>

      <section aria-label="Counts by type">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted">
          By type
        </h2>
        {summary.byType.length === 0 && !loading ? (
          <p className="mt-2 text-muted">No failures in this window.</p>
        ) : null}
        {summary.byType.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1">
            {summary.byType.map((row) => (
              <li key={row.type}>
                {row.type} {row.count}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">Loading</p> : null}
      {visible.length > 0 ? (
        <Table>
          <caption className="sr-only">Health events</caption>
          <TableHeader>
            <TableRow>
              <TableHead>{HEALTH_TIME_LABEL}</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Lead</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((event) => (
              <HealthRow key={event.id} event={event} />
            ))}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}

function HealthRow({ event }: { event: HealthEvent }) {
  return (
    <TableRow>
      <TableCell>
        <time dateTime={event.createdAt}>{formatHealthTime(event.createdAt)}</time>
      </TableCell>
      <TableCell>{event.source}</TableCell>
      <TableCell>{event.type}</TableCell>
      <TableCell>{detail(event.code)}</TableCell>
      <TableCell className="max-w-sm whitespace-normal">{event.message}</TableCell>
      <TableCell>{detail(event.page)}</TableCell>
      <TableCell>
        {event.leadId ? (
          <Link
            href={`/admin/blueprints?id=${event.leadId}`}
            className="font-mono text-xs uppercase tracking-wide text-accent"
          >
            {event.leadId}
          </Link>
        ) : (
          "—"
        )}
      </TableCell>
    </TableRow>
  );
}
