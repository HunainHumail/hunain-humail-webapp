"use client";

import { Button } from "@/components/admin/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { useInbox } from "@/hooks/useInbox";
import { cn } from "@/lib/utils/cn";

export interface MessagesPanelProps {
  className?: string;
}

function formatReceived(value: string): string {
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

export function MessagesPanel({ className }: MessagesPanelProps) {
  const { items, loading, error, markRead } = useInbox();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-muted">
          Admin
        </p>
        <h1 className="font-display text-4xl tracking-tight">Messages</h1>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">Loading</p> : null}
      {!loading && items.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : null}
      {items.length > 0 ? (
        <Table>
          <caption className="sr-only">Contact messages</caption>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p>{item.name}</p>
                  <p className="text-muted">{item.email}</p>
                </TableCell>
                <TableCell>{item.topic}</TableCell>
                <TableCell className="max-w-sm whitespace-normal">
                  {item.message}
                </TableCell>
                <TableCell>
                  <time dateTime={item.createdAt}>{formatReceived(item.createdAt)}</time>
                </TableCell>
                <TableCell>
                  {item.read ? (
                    <span className="font-mono text-xs uppercase tracking-wide text-muted">
                      Read
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        void markRead(item.id);
                      }}
                    >
                      Mark read
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}
