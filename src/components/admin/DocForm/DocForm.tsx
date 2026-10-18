"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import type { ZodTypeAny } from "zod";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Switch } from "@/components/admin/ui/switch";
import { Textarea } from "@/components/admin/ui/textarea";
import { blankFromFields, parseDocument } from "@/lib/admin/documentForm";
import type { FieldConfig } from "@/lib/admin/fields";
import { getPath, isRecord, readString, setRecordPath } from "@/lib/admin/record";
import { cn } from "@/lib/utils/cn";
import { ImageField } from "../ImageField";
import { MarkdownEditor } from "../MarkdownEditor";

export interface DocFormProps {
  fields: readonly FieldConfig[];
  schema: ZodTypeAny;
  values: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  errors?: Record<string, string>;
  disabled?: boolean;
  submitting?: boolean;
  className?: string;
}

function fieldDomId(path: string): string {
  return `field-${path.replace(/\./g, "-")}`;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function asRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord);
}

export function DocForm({
  fields,
  schema,
  values,
  onChange,
  onSubmit,
  errors = {},
  disabled,
  submitting,
  className,
}: DocFormProps) {
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [tagDrafts, setTagDrafts] = useState<Record<string, string>>({});
  const mergedErrors = { ...errors, ...clientErrors };

  function change(path: string, value: unknown) {
    setClientErrors((current) => {
      if (!current[path]) {
        return current;
      }
      const next = { ...current };
      delete next[path];
      return next;
    });
    onChange(setRecordPath(values, path, value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = parseDocument(schema, values, fields);
    if (!result.ok) {
      setClientErrors(result.errors);
      return;
    }
    setClientErrors({});
    await onSubmit(result.data);
  }

  return (
    <form
      className={cn("flex flex-col gap-5", className)}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      noValidate
    >
      {fields.map((field) => (
        <FieldControl
          key={field.name}
          field={field}
          path={field.name}
          values={values}
          errors={mergedErrors}
          tagDrafts={tagDrafts}
          onTagDraft={(path, draft) =>
            setTagDrafts((current) => ({ ...current, [path]: draft }))
          }
          onChange={change}
        />
      ))}
      {mergedErrors.form ? <p role="alert">{mergedErrors.form}</p> : null}
      <div>
        <Button type="submit" disabled={disabled || submitting}>
          {submitting ? "Saving" : "Save"}
        </Button>
      </div>
    </form>
  );
}

interface FieldControlProps {
  field: FieldConfig;
  path: string;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  tagDrafts: Record<string, string>;
  onTagDraft: (path: string, draft: string) => void;
  onChange: (path: string, value: unknown) => void;
}

function FieldControl({
  field,
  path,
  values,
  errors,
  tagDrafts,
  onTagDraft,
  onChange,
}: FieldControlProps) {
  const id = fieldDomId(path);
  const error = errors[path];
  const errorId = `${id}-error`;
  const value = getPath(values, path);

  if (field.type === "markdown") {
    return (
      <div className="flex flex-col gap-2">
        <MarkdownEditor
          id={id}
          label={field.label}
          value={readString(value)}
          invalid={Boolean(error)}
          describedBy={error ? errorId : undefined}
          onChange={(next) => onChange(path, next)}
        />
        {error ? (
          <p id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <ImageField
        id={id}
        label={field.label}
        value={readString(value)}
        description={field.description}
        error={error}
        onChange={(next) => onChange(path, next)}
      />
    );
  }

  if (field.type === "tags") {
    return (
      <TagsField
        id={id}
        label={field.label}
        tags={asStringList(value)}
        draft={tagDrafts[path] ?? ""}
        error={error}
        onDraft={(draft) => onTagDraft(path, draft)}
        onChange={(next) => onChange(path, next)}
      />
    );
  }

  if (field.type === "records" && field.fields) {
    return (
      <RecordsField
        field={field}
        path={path}
        rows={asRecords(value)}
        errors={errors}
        tagDrafts={tagDrafts}
        onTagDraft={onTagDraft}
        onChange={onChange}
      />
    );
  }

  if (field.type === "switch") {
    return (
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={id}>{field.label}</Label>
        <Switch
          id={id}
          checked={value === true}
          onCheckedChange={(checked) => onChange(path, checked === true)}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>{field.label}</Label>
        <select
          id={id}
          value={readString(value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-8 rounded-lg border border-border bg-surface px-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          onChange={(event) => onChange(path, event.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const inputType = field.type === "date" ? "date" : field.type === "url" ? "url" : "text";

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{field.label}</Label>
      {field.type === "textarea" ? (
        <Textarea
          id={id}
          value={readString(value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(path, event.target.value)}
        />
      ) : (
        <Input
          id={id}
          type={inputType}
          value={readString(value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(path, event.target.value)}
        />
      )}
      {error ? (
        <p id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TagsField({
  id,
  label,
  tags,
  draft,
  error,
  onDraft,
  onChange,
}: {
  id: string;
  label: string;
  tags: string[];
  draft: string;
  error?: string;
  onDraft: (draft: string) => void;
  onChange: (tags: string[]) => void;
}) {
  function add(raw: string) {
    const tag = raw.trim();
    if (!tag || tags.includes(tag)) {
      onDraft("");
      return;
    }
    onChange([...tags, tag]);
    onDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }
    event.preventDefault();
    add(draft);
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                className="rounded-full border border-border px-2 py-1 font-mono text-xs uppercase tracking-wide"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(tags.filter((item) => item !== tag))}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onDraft(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <Button type="button" variant="outline" onClick={() => add(draft)}>
          Add {label}
        </Button>
      </div>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}

function RecordsField({
  field,
  path,
  rows,
  errors,
  tagDrafts,
  onTagDraft,
  onChange,
}: {
  field: FieldConfig;
  path: string;
  rows: Record<string, unknown>[];
  errors: Record<string, string>;
  tagDrafts: Record<string, string>;
  onTagDraft: (path: string, draft: string) => void;
  onChange: (path: string, value: unknown) => void;
}) {
  const subfields = field.fields ?? [];
  const error = errors[path];

  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <legend className="px-1 font-mono text-xs uppercase tracking-wide text-muted">
        {field.label}
      </legend>
      {rows.map((row, index) => (
        <div key={`${path}-${index}`} className="flex flex-col gap-3 border-b border-border pb-3">
          {subfields.map((subfield) => (
            <FieldControl
              key={subfield.name}
              field={subfield}
              path={`${path}.${index}.${subfield.name}`}
              values={rowPathValues(path, index, row)}
              errors={errors}
              tagDrafts={tagDrafts}
              onTagDraft={onTagDraft}
              onChange={onChange}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onChange(
                path,
                rows.filter((_, rowIndex) => rowIndex !== index),
              )
            }
          >
            Remove {field.label} {index + 1}
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange(path, [...rows, blankFromFields(subfields)])}
      >
        Add {field.label}
      </Button>
      {error ? <p role="alert">{error}</p> : null}
    </fieldset>
  );
}

function rowPathValues(
  path: string,
  index: number,
  row: Record<string, unknown>,
): Record<string, unknown> {
  const keys = path.split(".");
  let current: Record<string, unknown> = {};
  const root = current;
  for (let cursor = 0; cursor < keys.length; cursor += 1) {
    const key = keys[cursor];
    if (!key) {
      continue;
    }
    if (cursor === keys.length - 1) {
      current[key] = [rowAt(index, row)];
      break;
    }
    const next: Record<string, unknown> = {};
    current[key] = next;
    current = next;
  }
  return root;
}

function rowAt(index: number, row: Record<string, unknown>): unknown[] {
  const list: unknown[] = [];
  list[index] = row;
  return list;
}
