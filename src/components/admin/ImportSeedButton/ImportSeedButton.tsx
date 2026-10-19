"use client";

import { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  formatSeedImportSummary,
  importSeedData,
} from "@/services/importSeed";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

export interface ImportSeedButtonProps {
  className?: string;
}

export function ImportSeedButton({ className }: ImportSeedButtonProps) {
  const { isAdmin: admin } = useAuth();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!admin) {
    return null;
  }

  async function confirmImport() {
    setPending(true);
    setError(null);
    setNotice(null);
    try {
      const result = await importSeedData();
      const summary = formatSeedImportSummary(result.counts);
      setNotice(summary);
      toast.success(summary);
      setOpen(false);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Could not import seed data.";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Button type="button" onClick={() => setOpen(true)}>
        Import seed data
      </Button>
      {notice ? <p role="status">{notice}</p> : null}
      {!open && error ? <p role="alert">{error}</p> : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import seed data?</DialogTitle>
            <DialogDescription>
              This upserts the same profile, story, now, work (30 projects),
              writing (talks, awards, and LinkedIn posts), and settings the
              public site uses.
            </DialogDescription>
          </DialogHeader>
          {error ? <p role="alert">{error}</p> : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={pending}
              onClick={() => {
                void confirmImport();
              }}
            >
              {pending ? "Importing" : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
