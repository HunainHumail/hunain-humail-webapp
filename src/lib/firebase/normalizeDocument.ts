function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasToDate(
  value: object,
): value is { toDate: () => Date } {
  return (
    "toDate" in value &&
    typeof (value as { toDate: unknown }).toDate === "function"
  );
}

export function normalizeValue(value: unknown): unknown {
  if (typeof value === "object" && value !== null && hasToDate(value)) {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        normalizeValue(nested),
      ]),
    );
  }

  return value;
}

export function normalizeDocument(
  id: string,
  data: unknown,
): Record<string, unknown> {
  const normalized = normalizeValue(data);
  if (!isPlainObject(normalized)) {
    return { id };
  }
  return { id, ...normalized };
}
