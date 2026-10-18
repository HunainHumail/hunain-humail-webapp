"use client";

import { useCallback, useState } from "react";
import type { ZodTypeAny } from "zod";
import { parseDocument } from "@/lib/admin/documentForm";
import type { FieldConfig } from "@/lib/admin/fields";
import { setRecordPath } from "@/lib/admin/record";

export interface UseDocEditorOptions {
  schema: ZodTypeAny;
  fields: readonly FieldConfig[];
  initial: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

export interface UseDocEditorResult {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
  update: (path: string, value: unknown) => void;
  replace: (next: Record<string, unknown>) => void;
  save: (data?: Record<string, unknown>) => Promise<boolean>;
}

export function useDocEditor({
  schema,
  fields,
  initial,
  onSave,
}: UseDocEditorOptions): UseDocEditorResult {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [trackedInitial, setTrackedInitial] = useState(() =>
    JSON.stringify(initial),
  );
  const serializedInitial = JSON.stringify(initial);
  if (!dirty && trackedInitial !== serializedInitial) {
    setTrackedInitial(serializedInitial);
    setValues(initial);
  }

  const update = useCallback((path: string, value: unknown) => {
    setValues((current) => setRecordPath(current, path, value));
    setDirty(true);
    setSaveError(null);
  }, []);

  const replace = useCallback((next: Record<string, unknown>) => {
    setValues(next);
    setDirty(true);
    setSaveError(null);
  }, []);

  const save = useCallback(
    async (data?: Record<string, unknown>) => {
      const source = data ?? values;
      const parsed = parseDocument(schema, source, fields);
      if (!parsed.ok) {
        setErrors(parsed.errors);
        return false;
      }
      setSaving(true);
      setSaveError(null);
      try {
        await onSave(parsed.data);
        setValues(parsed.data);
        setErrors({});
        setDirty(false);
        return true;
      } catch (caught: unknown) {
        setSaveError(
          caught instanceof Error ? caught.message : "Could not save",
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [fields, onSave, schema, values],
  );

  return {
    values,
    errors,
    dirty,
    saving,
    saveError,
    update,
    replace,
    save,
  };
}
