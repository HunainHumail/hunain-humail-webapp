"use client";

import Link from "next/link";
import { BlueprintCanvas } from "@/components/organisms/BlueprintCanvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import type { BlueprintLead, BlueprintLeadStatus } from "@/lib/schemas/blueprint";
import { cn } from "@/lib/utils/cn";

export interface BlueprintLeadDetailProps {
  lead: BlueprintLead;
  onStatusChange: (status: BlueprintLeadStatus) => void;
  backHref?: string;
  className?: string;
}

export function BlueprintLeadDetail({
  lead,
  onStatusChange,
  backHref = "/admin/blueprints",
  className,
}: BlueprintLeadDetailProps) {
  const appName = lead.spec?.appName ?? "App blueprint";
  const mailSubject = encodeURIComponent(`Your ${appName} blueprint`);
  const mailto = `mailto:${lead.email}?subject=${mailSubject}`;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Link
        href={backHref}
        className="font-mono text-xs uppercase tracking-wide text-accent"
      >
        Back to list
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{lead.email}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            <a href={mailto} className="text-accent underline-offset-4 hover:underline">
              Email lead
            </a>
          </p>
          <p>
            <span className="text-muted">Idea: </span>
            {lead.idea}
          </p>
          <p>
            <span className="text-muted">Platform: </span>
            {lead.platform}
          </p>
          <p>
            <span className="text-muted">Model: </span>
            {lead.modelId}
          </p>
          <p>
            <span className="text-muted">Tokens: </span>
            {`${lead.usage.inputTokens} in / ${lead.usage.outputTokens} out`}
          </p>
          <p>
            <span className="text-muted">Created: </span>
            {lead.createdAt}
          </p>
          <p>
            <span className="text-muted">IP hash prefix: </span>
            {lead.ipHash.slice(0, 8)}
          </p>
          <div className="flex flex-col gap-1">
            <label htmlFor="lead-status" className="text-muted">
              Lead status
            </label>
            <Select value={lead.status} onValueChange={(v) => onStatusChange(v as BlueprintLeadStatus)}>
              <SelectTrigger id="lead-status" className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {lead.contactMessageId ? (
            <p>
              <Link
                href="/admin/messages"
                className="font-mono text-xs uppercase tracking-wide text-accent"
              >
                Related message
              </Link>
            </p>
          ) : null}
        </CardContent>
      </Card>

      {lead.spec ? (
        <BlueprintCanvas spec={lead.spec} copyLabel="Copy plan" />
      ) : (
        <p className="text-muted">
          Generation failed ({lead.errorCode ?? "unknown"}).
        </p>
      )}
    </div>
  );
}
