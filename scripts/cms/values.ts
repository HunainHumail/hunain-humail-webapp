export type FirestoreValue =
  | { nullValue: "NULL_VALUE" }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { timestampValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function encodeValue(value: unknown): FirestoreValue {
  if (value === null) {
    return { nullValue: "NULL_VALUE" };
  }
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Cannot encode a non-finite number");
    }
    if (Number.isInteger(value)) {
      return { integerValue: String(value) };
    }
    return { doubleValue: value };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => encodeValue(item)),
      },
    };
  }
  if (isPlainObject(value)) {
    return { mapValue: { fields: encodeMap(value) } };
  }
  throw new Error(`Unsupported Firestore value type: ${typeof value}`);
}

export function encodeMap(
  data: Record<string, unknown>,
): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, nested] of Object.entries(data)) {
    if (nested === undefined) {
      continue;
    }
    fields[key] = encodeValue(nested);
  }
  return fields;
}

export function decodeValue(value: unknown): unknown {
  if (!isPlainObject(value)) {
    return value;
  }
  if ("nullValue" in value) {
    return null;
  }
  if ("booleanValue" in value) {
    return value.booleanValue === true;
  }
  if (typeof value.stringValue === "string") {
    return value.stringValue;
  }
  if (typeof value.integerValue === "string" || typeof value.integerValue === "number") {
    return Number(value.integerValue);
  }
  if (typeof value.doubleValue === "number") {
    return value.doubleValue;
  }
  if (typeof value.timestampValue === "string") {
    return value.timestampValue;
  }
  if (isPlainObject(value.arrayValue)) {
    const values = value.arrayValue.values;
    return Array.isArray(values) ? values.map((item) => decodeValue(item)) : [];
  }
  if (isPlainObject(value.mapValue)) {
    const fields = value.mapValue.fields;
    return decodeMap(isPlainObject(fields) ? fields : undefined);
  }
  return value;
}

export function decodeMap(
  fields: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!fields) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(fields).map(([key, nested]) => [key, decodeValue(nested)]),
  );
}

export function documentIdFromName(name: string): string {
  const segments = name.split("/");
  const id = segments[segments.length - 1];
  if (!id) {
    throw new Error("Firestore document name is missing an id");
  }
  return id;
}
