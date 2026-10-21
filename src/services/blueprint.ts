import {
  BlueprintError,
  blueprintErrorKindFromFirebase,
} from "@/lib/blueprint/errors";
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

export async function warmUpBlueprint(): Promise<void> {
  if (isBlueprintMockEnabled() || !isFirebaseConfigured()) {
    return;
  }
  const mod = await import("@/lib/firebase/functions");
  await mod.warmUpAppCheck();
}

export async function generateBlueprint(input: unknown): Promise<BlueprintResult> {
  const parsed = blueprintRequestSchema.safeParse(input);
  if (!parsed.success) {
    throw new BlueprintError("invalid-input");
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new BlueprintError("offline");
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
    throw new BlueprintError("unavailable");
  }

  const { getBlueprintCallable, ensureAppCheckToken } = await import(
    "@/lib/firebase/functions"
  );
  const callable = await getBlueprintCallable();

  try {
    await ensureAppCheckToken();
  } catch {
    throw new BlueprintError("app-check");
  }

  const invoke = () => withTimeout(callable(parsed.data), 25_000);
  try {
    let result;
    try {
      result = await invoke();
    } catch (first: unknown) {
      // Stale/expired token on a long-open tab: refresh once and retry.
      const code = String((first as { code?: unknown })?.code ?? "");
      if (code !== "functions/unauthenticated") {
        throw first;
      }
      try {
        await ensureAppCheckToken(true);
      } catch {
        throw new BlueprintError("app-check");
      }
      result = await invoke();
    }
    const data = result.data;
    const response = blueprintResponseSchema.safeParse(data);
    if (!response.success) {
      throw new BlueprintError("invalid-output");
    }
    return response.data;
  } catch (error: unknown) {
    if (error instanceof BlueprintError) {
      throw error;
    }
    if (error instanceof Error && error.message.includes("timed out")) {
      throw new BlueprintError("timeout");
    }
    const kind = blueprintErrorKindFromFirebase(
      error as { code?: string; customData?: { details?: { reason?: string } } },
    );
    throw new BlueprintError(kind);
  }
}
