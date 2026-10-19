import type { ZodError, ZodTypeAny } from "zod";
import type { FieldConfig } from "./fields";
import {
  deletePath,
  isRecord,
  setRecordPath,
  stripUndefined,
} from "./record";

const OPTIONAL_TEXT_TYPES = new Set<FieldConfig["type"]>([
  "text",
  "textarea",
  "markdown",
  "url",
  "image",
  "date",
]);

export function zodFieldErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.map(String).join(".");
    const key = path.length > 0 ? path : "form";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export function coerceOptionalFields(
  values: Record<string, unknown>,
  fields: readonly FieldConfig[],
): Record<string, unknown> {
  let next = values;
  for (const field of fields) {
    if (field.type === "records" && field.fields) {
      const list = next[field.name];
      if (!Array.isArray(list)) {
        continue;
      }
      const mapped = list.map((item) =>
        isRecord(item) ? coerceOptionalFields(item, field.fields ?? []) : item,
      );
      next = setRecordPath(next, field.name, mapped);
      continue;
    }

    if (!field.optional || !OPTIONAL_TEXT_TYPES.has(field.type)) {
      continue;
    }

    const current = field.name.includes(".")
      ? readDotted(next, field.name)
      : next[field.name];
    if (current === "") {
      next = deletePath(next, field.name);
    }
  }
  return next;
}

function readDotted(source: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = source;
  for (const key of keys) {
    if (!isRecord(current)) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

export function prepareDocument(
  values: Record<string, unknown>,
  fields: readonly FieldConfig[],
  updatedAt = new Date().toISOString(),
): Record<string, unknown> {
  const coerced = coerceOptionalFields(values, fields);
  const stripped = stripUndefined(coerced);
  const record = isRecord(stripped) ? stripped : {};
  return { ...record, updatedAt };
}

export type ParseResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; errors: Record<string, string> };

export function parseDocument(
  schema: ZodTypeAny,
  values: Record<string, unknown>,
  fields: readonly FieldConfig[],
): ParseResult {
  const prepared = prepareDocument(values, fields);
  const parsed = schema.safeParse(prepared);
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }
  const data: unknown = parsed.data;
  if (!isRecord(data)) {
    return { ok: false, errors: { form: "Document is invalid" } };
  }
  return { ok: true, data };
}

export function hydrateDocument(
  schema: ZodTypeAny,
  document: Record<string, unknown>,
): Record<string, unknown> {
  const parsed = schema.safeParse(document);
  if (!parsed.success || !isRecord(parsed.data)) {
    return document;
  }
  const stripped = stripUndefined(parsed.data);
  if (!isRecord(stripped)) {
    return document;
  }
  const id = typeof document.id === "string" ? document.id : undefined;
  return id ? { ...stripped, id } : stripped;
}

export function formatSchemaIssues(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "document"}: ${issue.message}`)
    .join("; ");
}

export function blankFromFields(
  fields: readonly FieldConfig[],
): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const field of fields) {
    record[field.name] = defaultFieldValue(field);
  }
  return record;
}

function defaultFieldValue(field: FieldConfig): unknown {
  switch (field.type) {
    case "tags":
    case "records":
      return [];
    case "switch":
      return false;
    case "select":
      return field.options?.[0]?.value ?? "";
    default:
      return "";
  }
}
