"use client";

import { useState } from "react";
import type { AdminCollectionName } from "@/lib/admin/collections";
import { getCollectionConfig } from "@/lib/admin/collections";
import { useDocEditor } from "@/hooks/useDocEditor";
import { cn } from "@/lib/utils/cn";
import { DocForm } from "../DocForm";
import { StatusToggle } from "../StatusToggle";

export interface EditorFormProps {
  collection: AdminCollectionName;
  initial: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  className?: string;
}

export function EditorForm({
  collection,
  initial,
  onSave,
  className,
}: EditorFormProps) {
  const config = getCollectionConfig(collection);
  const editor = useDocEditor({
    schema: config.schema,
    fields: config.fields,
    initial,
    onSave,
  });
  const [notice, setNotice] = useState<string | null>(null);
  const status = editor.values.status === "published" ? "published" : "draft";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <StatusToggle
        value={status}
        onChange={(next) => {
          setNotice(null);
          editor.update("status", next);
        }}
      />
      {editor.dirty ? <p className="text-sm text-muted">Unsaved changes</p> : null}
      <DocForm
        fields={config.fields}
        schema={config.schema}
        values={editor.values}
        errors={editor.errors}
        disabled={!editor.dirty}
        submitting={editor.saving}
        onChange={(next) => {
          setNotice(null);
          editor.replace(next);
        }}
        onSubmit={async (data) => {
          const saved = await editor.save(data);
          setNotice(saved ? "Saved" : null);
        }}
      />
      {editor.saveError ? <p role="alert">{editor.saveError}</p> : null}
      {notice ? <p role="status">{notice}</p> : null}
    </div>
  );
}
