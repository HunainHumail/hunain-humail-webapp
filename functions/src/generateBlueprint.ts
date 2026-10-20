import { HttpsError, type CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { parseBlueprintSpec } from "@/lib/blueprint/parseSpec";
import { buildBlueprintPrompt } from "@/lib/blueprint/prompt";
import { rateLimitKeys, isRateLimitExempt, type RateLimitConfig } from "@/lib/blueprint/rateLimit";
import {
  blueprintRequestSchema,
  type BlueprintErrorCode,
  type BlueprintSpec,
} from "@/lib/schemas/blueprint";
import type { GeminiLlm } from "./geminiClient";
import { ProviderQuotaError, TimeoutError } from "./geminiClient";
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
}

export function createGenerateBlueprintHandler(deps: GenerateBlueprintDeps) {
  return async (request: CallableRequest<unknown>) => {
    const started = Date.now();
    const parsed = blueprintRequestSchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError("invalid-argument", "Invalid input", {
        fields: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, idea, platform } = parsed.data;
    const ipRaw = deps.hash.ip(request.rawRequest);
    const ipHash = deps.hash.hmac(ipRaw);
    const emailHash = deps.hash.hmac(email);
    const now = deps.now();
    const keys = rateLimitKeys({ ipHash, emailHash, now });
    const exempt = isRateLimitExempt({
      email,
      headers: request.rawRequest?.headers as Record<string, unknown> | undefined,
    });

    if (!exempt) {
      const reserved = await deps.store.reserve(keys, deps.limits, now);
      if (!reserved.ok) {
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
  };
}
