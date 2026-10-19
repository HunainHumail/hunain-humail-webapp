export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function toRecord(value: object): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    record[key] = nested;
  }
  return record;
}

export function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function getPath(source: unknown, path: string): unknown {
  const keys = path.split(".").filter((key) => key.length > 0);
  return keys.reduce<unknown>((current, key) => {
    if (Array.isArray(current)) {
      return current[Number(key)];
    }
    if (isRecord(current)) {
      return current[key];
    }
    return undefined;
  }, source);
}

function setKeys(source: unknown, keys: string[], value: unknown): unknown {
  const [head, ...rest] = keys;
  if (!head) {
    return value;
  }

  if (rest.length === 0) {
    if (Array.isArray(source)) {
      const copy = source.slice();
      copy[Number(head)] = value;
      return copy;
    }
    const record = isRecord(source) ? { ...source } : {};
    record[head] = value;
    return record;
  }

  if (Array.isArray(source)) {
    const copy = source.slice();
    const index = Number(head);
    copy[index] = setKeys(copy[index], rest, value);
    return copy;
  }

  const record = isRecord(source) ? { ...source } : {};
  record[head] = setKeys(record[head], rest, value);
  return record;
}

export function setPath(
  source: unknown,
  path: string,
  value: unknown,
): unknown {
  const keys = path.split(".").filter((key) => key.length > 0);
  return setKeys(source, keys, value);
}

export function setRecordPath(
  source: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const next = setPath(source, path, value);
  return isRecord(next) ? next : source;
}

export function deletePath(
  source: Record<string, unknown>,
  path: string,
): Record<string, unknown> {
  const keys = path.split(".").filter((key) => key.length > 0);
  const [head, ...rest] = keys;
  if (!head) {
    return source;
  }
  if (rest.length === 0) {
    const next = { ...source };
    delete next[head];
    return next;
  }
  const child = source[head];
  if (!isRecord(child)) {
    return source;
  }
  return { ...source, [head]: deletePath(child, rest.join(".")) };
}

export { stripUndefined } from "@/lib/utils/stripUndefined";
