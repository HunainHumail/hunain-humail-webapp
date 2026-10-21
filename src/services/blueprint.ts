import {
  BlueprintError,
  blueprintErrorKindFromFirebase,
  type BlueprintErrorKind,
} from "@/lib/blueprint/errors";
import { reportClientError } from "@/lib/health/reportClientError";
import {
  blueprintRequestSchema,
  blueprintResponseSchema,
  type BlueprintResponse,
  type BlueprintSpec,
} from "@/lib/schemas/blueprint";
import { blueprintSampleSpecMobile } from "@/lib/seed/blueprint";
import {
  isBlueprintMockEnabled,
  isFirebaseConfigured,
} from "@/lib/env";
import { withTimeout } from "@/services/liveContent";

export type BlueprintResult = BlueprintResponse;

const MOCK_DELAY_MS = 600;
const CALL_TIMEOUT_MS = 25_000;
/** App Check plus the callable, including one token refresh, must finish inside this. */
const FLOW_TIMEOUT_MS = 60_000;

export async function warmUpBlueprint(): Promise<void> {
  if (isBlueprintMockEnabled() || !isFirebaseConfigured()) {
    return;
  }
  const mod = await import("@/lib/firebase/functions");
  await mod.warmUpAppCheck();
}

function readCode(error: unknown): string {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return "";
  }
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : "";
}

function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes("timed out");
}

function reportBlueprintFailure(
  kind: BlueprintErrorKind,
  raw: unknown,
  redact: readonly string[],
  reported: { current: boolean },
): void {
  if (reported.current) {
    return;
  }
  reported.current = true;
  const message = raw instanceof Error && raw.message ? raw.message : kind;
  reportClientError({
    type: kind,
    code: readCode(raw),
    message,
    redact,
  });
}

function fail(
  kind: BlueprintErrorKind,
  raw: unknown,
  redact: readonly string[],
  reported: { current: boolean },
): BlueprintError {
  reportBlueprintFailure(kind, raw, redact, reported);
  return new BlueprintError(kind);
}

export async function generateBlueprint(input: unknown): Promise<BlueprintResult> {
  const parsed = blueprintRequestSchema.safeParse(input);
  const reported = { current: false };
  if (!parsed.success) {
    reportBlueprintFailure("invalid-input", undefined, [], reported);
    throw new BlueprintError("invalid-input");
  }

  const redact = [parsed.data.email, parsed.data.idea];

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw fail("offline", undefined, redact, reported);
  }

  if (isBlueprintMockEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const platform = parsed.data.platform;
    const spec: BlueprintSpec = {
      ...blueprintSampleSpecMobile,
      platform,
      appName:
        platform === "web"
          ? `${blueprintSampleSpecMobile.appName} Web`
          : blueprintSampleSpecMobile.appName,
    };
    return { leadId: "mock-lead", spec };
  }

  if (!isFirebaseConfigured()) {
    throw fail("unavailable", undefined, redact, reported);
  }

  const work = (async () => {
    const { getBlueprintCallable, ensureAppCheckToken } = await import(
      "@/lib/firebase/functions"
    );
    const callable = await getBlueprintCallable();

    try {
      await ensureAppCheckToken();
    } catch (error: unknown) {
      throw fail("app-check", error, redact, reported);
    }

    const invoke = () => withTimeout(callable(parsed.data), CALL_TIMEOUT_MS);
    try {
      let result;
      try {
        result = await invoke();
      } catch (first: unknown) {
        // Stale/expired token on a long-open tab: refresh once and retry.
        if (readCode(first) !== "functions/unauthenticated") {
          throw first;
        }
        try {
          await ensureAppCheckToken(true);
        } catch (error: unknown) {
          throw fail("app-check", error, redact, reported);
        }
        result = await invoke();
      }
      const response = blueprintResponseSchema.safeParse(result.data);
      if (!response.success) {
        throw fail("invalid-output", undefined, redact, reported);
      }
      return response.data;
    } catch (error: unknown) {
      if (error instanceof BlueprintError) {
        throw error;
      }
      if (isTimeoutError(error)) {
        throw fail("timeout", error, redact, reported);
      }
      throw fail(
        blueprintErrorKindFromFirebase(error),
        error,
        redact,
        reported,
      );
    }
  })();

  void work.catch(() => undefined);

  try {
    return await withTimeout(work, FLOW_TIMEOUT_MS);
  } catch (error: unknown) {
    if (error instanceof BlueprintError) {
      throw error;
    }
    if (isTimeoutError(error)) {
      throw fail("timeout", error, redact, reported);
    }
    throw fail(blueprintErrorKindFromFirebase(error), error, redact, reported);
  }
}
