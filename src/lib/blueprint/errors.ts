export type BlueprintErrorKind =
  | "invalid-input"
  | "rate-limit"
  | "daily-budget"
  | "provider-quota"
  | "timeout"
  | "invalid-output"
  | "app-check"
  | "offline"
  | "unavailable"
  | "unknown";

export class BlueprintError extends Error {
  readonly kind: BlueprintErrorKind;

  constructor(kind: BlueprintErrorKind, message?: string) {
    super(message ?? kind);
    this.name = "BlueprintError";
    this.kind = kind;
  }
}

function readFirebaseReason(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const record = error as Record<string, unknown>;
  const details =
    record.details ??
    (record.customData as Record<string, unknown> | undefined)?.details;
  if (details && typeof details === "object" && "reason" in details) {
    const reason = (details as { reason?: unknown }).reason;
    return typeof reason === "string" ? reason : undefined;
  }
  return undefined;
}

export function blueprintErrorKindFromFirebase(error: unknown): BlueprintErrorKind {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";
  const reason = readFirebaseReason(error);

  if (code === "functions/invalid-argument") {
    return "invalid-input";
  }
  if (code === "functions/unauthenticated") {
    return "app-check";
  }
  if (code === "functions/deadline-exceeded") {
    return "timeout";
  }
  if (code === "functions/resource-exhausted") {
    if (reason === "daily-budget") {
      return "daily-budget";
    }
    if (reason === "provider-quota") {
      return "provider-quota";
    }
    return "rate-limit";
  }
  if (code === "functions/internal") {
    if (reason === "invalid-output") {
      return "invalid-output";
    }
    return "unknown";
  }
  return "unknown";
}
