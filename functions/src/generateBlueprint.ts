import { HttpsError, type CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { parseBlueprintSpec } from "@/lib/blueprint/parseSpec";
import { buildBlueprintPrompt } from "@/lib/blueprint/prompt";
import { rateLimitKeys, isRateLimitExempt, type RateLimitConfig } from "@/lib/blueprint/rateLimit";
import {
  blueprintRequestSchema,
  type BlueprintErrorCode,
  type BlueprintRequest,
  type BlueprintSpec,
} from "@/lib/schemas/blueprint";
import type { GeminiLlm } from "./geminiClient";
import { ProviderQuotaError, TimeoutError } from "./geminiClient";
import type { HealthEventWriter, ServerHealthEvent } from "./healthEvents";
import type { LeadStore } from "./leadStore";

export interface GenerateBlueprintDeps {
  llm: GeminiLlm;
  store: LeadStore;
  hash: {
    ip: (raw: CallableRequest["rawRequest"]) => string;
    hmac: (value: string) => string;
  };
  now: () => Date;
  limits: RateLimitConfig;
  modelId: string;
  deadlineMs: number;
  health: HealthEventWriter;
}

function failureMeta(type: string): { code: string; message: string } {
  switch (type) {
    case "timeout":
      return { code: "deadline-exceeded", message: "Timeout" };
    case "invalid-output":
      return { code: "internal", message: "Invalid output" };
    case "provider-quota":
      return { code: "resource-exhausted", message: "Provider quota" };
    case "provider-error":
      return { code: "internal", message: "Provider error" };
    case "rate-limit":
      return { code: "resource-exhausted", message: "Rate limited" };
    case "daily-budget":
      return { code: "resource-exhausted", message: "Daily budget" };
    default:
      return { code: "internal", message: "Request failed" };
  }
}

async function recordFailure(
  health: HealthEventWriter,
  event: ServerHealthEvent,
): Promise<void> {
  try {
    await health.write(event);
  } catch (error: unknown) {
    logger.warn("healthEvents write failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}

export function createGenerateBlueprintHandler(deps: GenerateBlueprintDeps) {
  return async (request: CallableRequest<unknown>) => {
    const parsed = blueprintRequestSchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError("invalid-argument", "Invalid input", {
        fields: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      return await runGenerate(deps, request, parsed.data);
    } catch (error: unknown) {
      if (error instanceof HttpsError) {
        throw error;
      }
      const code = error instanceof Error ? error.name : "unknown";
      await recordFailure(deps.health, {
        type: "unexpected",
        code,
        message: "Unexpected error",
      });
      throw error;
    }
  };
}

async function runGenerate(
  deps: GenerateBlueprintDeps,
  request: CallableRequest<unknown>,
  parsedData: BlueprintRequest,
) {
    const started = Date.now();

    const { email, idea, platform } = parsedData;
    const ipRaw = deps.hash.ip(request.rawRequest);
    const ipHash = deps.hash.hmac(ipRaw);
    const emailHash = deps.hash.hmac(email);
    const now = deps.now();
    const keys = rateLimitKeys({ ipHash, emailHash, now });
    const exempt = isRateLimitExempt({
      email,
      headers: request.rawRequest?.headers as Record<string, unknown> | undefined,
    });

    // Token saver: a repeat submit / retry of the same idea reuses the saved
    // blueprint instead of calling the model again.
    if (deps.store.findSaved) {
      try {
        const saved = await deps.store.findSaved({ email, idea, platform });
        if (saved) {
          logger.info("generateBlueprint cache hit", { leadId: saved.id });
          return { leadId: saved.id, spec: saved.spec };
        }
      } catch (error: unknown) {
        logger.warn("generateBlueprint cache lookup failed", {
          message: error instanceof Error ? error.message : "unknown",
        });
      }
    }

    if (!exempt) {
      const reserved = await deps.store.reserve(keys, deps.limits, now);
      if (!reserved.ok) {
        const meta = failureMeta(reserved.reason);
        await recordFailure(deps.health, {
          type: reserved.reason,
          code: meta.code,
          message: meta.message,
        });
        throw new HttpsError("resource-exhausted", "Rate limited", {
          reason: reserved.reason,
        });
      }
    }

    const deadline = started + deps.deadlineMs;
    let inputTokens = 0;
    let outputTokens = 0;
    let spec: BlueprintSpec | undefined;
    let errorCode: BlueprintErrorCode | undefined;

    const { system, user } = buildBlueprintPrompt({ idea, platform });

    for (let attempt = 0; attempt < 2; attempt++) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        errorCode = "timeout";
        break;
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), remaining);
      try {
        const result = await deps.llm.generate({
          system,
          user,
          signal: controller.signal,
        });
        inputTokens += result.inputTokens;
        outputTokens += result.outputTokens;
        const parsedSpec = parseBlueprintSpec(result.text, platform);
        if (parsedSpec.ok) {
          spec = parsedSpec.spec;
          break;
        }
        logger.warn("generateBlueprint invalid output", {
          attempt,
          issues: parsedSpec.issues.slice(0, 8),
        });
        if (attempt === 0 && deadline - Date.now() >= 4000) {
          continue;
        }
        errorCode = "invalid-output";
        break;
      } catch (error: unknown) {
        logger.error("generateBlueprint llm failed", {
          attempt,
          message: error instanceof Error ? error.message : "unknown",
        });
        if (error instanceof ProviderQuotaError) {
          errorCode = "provider-quota";
          break;
        }
        if (error instanceof TimeoutError) {
          errorCode = "timeout";
          break;
        }
        errorCode = "provider-error";
        break;
      } finally {
        clearTimeout(timer);
      }
    }

    if (!spec && !errorCode) {
      errorCode = "invalid-output";
    }

    const generationStatus = spec ? "success" : "failed";
    const lead = await deps.store.writeLead({
      email,
      idea,
      platform,
      generationStatus,
      spec,
      errorCode,
      modelId: deps.modelId,
      usage: { inputTokens, outputTokens },
      ipHash,
      status: "new",
    });

    logger.info("generateBlueprint", {
      leadId: lead.id,
      ipHashPrefix: ipHash.slice(0, 8),
      errorCode: errorCode ?? null,
      durationMs: Date.now() - started,
    });

    if (errorCode) {
      const meta = failureMeta(errorCode);
      await recordFailure(deps.health, {
        type: errorCode,
        code: meta.code,
        message: meta.message,
        leadId: lead.id,
      });
    }

    if (errorCode === "provider-quota") {
      throw new HttpsError("resource-exhausted", "Provider quota", {
        reason: "provider-quota",
      });
    }
    if (errorCode === "timeout") {
      throw new HttpsError("deadline-exceeded", "Timeout");
    }
    if (errorCode === "invalid-output") {
      throw new HttpsError("internal", "Invalid output", {
        reason: "invalid-output",
      });
    }
    if (errorCode === "provider-error") {
      throw new HttpsError("internal", "Provider error", {
        reason: "provider-error",
      });
    }

    if (!spec) {
      throw new HttpsError("internal", "No spec");
    }

    return { leadId: lead.id, spec };
}
