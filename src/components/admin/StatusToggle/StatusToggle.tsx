"use client";

import { Label } from "@/components/admin/ui/label";
import { Switch } from "@/components/admin/ui/switch";
import { cn } from "@/lib/utils/cn";

export interface StatusToggleProps {
  value: "draft" | "published";
  onChange: (value: "draft" | "published") => void;
  disabled?: boolean;
  className?: string;
}

export function StatusToggle({
  value,
  onChange,
  disabled,
  className,
}: StatusToggleProps) {
  const published = value === "published";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Label htmlFor="document-status">Published</Label>
      <Switch
        id="document-status"
        checked={published}
        disabled={disabled}
        onCheckedChange={(checked) =>
          onChange(checked ? "published" : "draft")
        }
      />
      <span className="font-mono text-xs uppercase tracking-wide text-muted">
        {published ? "Published" : "Draft"}
      </span>
    </div>
  );
}
