function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item));
  }
  if (!isPlainObject(value)) {
    return value;
  }
  const entries = Object.entries(value).flatMap(([key, nested]) => {
    if (nested === undefined) {
      return [];
    }
    return [[key, stripUndefined(nested)] as const];
  });
  return Object.fromEntries(entries);
}
