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
import { importSeedData } from "@/services/importSeed";
import { cn } from "@/lib/utils/cn";

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
      await importSeedData();
      setNotice("Seed data imported.");
      setOpen(false);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not import seed data.",
      );
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
      {error ? <p role="alert">{error}</p> : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import seed data?</DialogTitle>
            <DialogDescription>
              This writes the built-in profile, story, now, work, writing, and
              settings into Firestore.
            </DialogDescription>
          </DialogHeader>
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
