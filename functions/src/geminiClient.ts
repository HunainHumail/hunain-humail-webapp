import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { blueprintGeminiResponseSchema } from "@/lib/blueprint/responseSchema";

export class ProviderQuotaError extends Error {
  constructor(message = "Provider quota exceeded") {
    super(message);
    this.name = "ProviderQuotaError";
  }
}

export class TimeoutError extends Error {
  constructor(message = "LLM timeout") {
    super(message);
    this.name = "TimeoutError";
  }
}

export interface LlmGenerateInput {
  system: string;
  user: string;
  signal?: AbortSignal;
}

export interface LlmGenerateResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

export interface GeminiLlm {
  generate(input: LlmGenerateInput): Promise<LlmGenerateResult>;
}

export function createGeminiLlm(apiKey: string, model: string): GeminiLlm {
  const client = new GoogleGenAI({ apiKey });

  return {
    async generate({ system, user, signal }) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: user,
          config: {
            systemInstruction: system,
            responseMimeType: "application/json",
            responseSchema: blueprintGeminiResponseSchema,
            maxOutputTokens: 3072,
            temperature: 0.4,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            abortSignal: signal,
          },
        });

        const text = response.text ?? "";
        const usage = response.usageMetadata;
        return {
          text,
          inputTokens: usage?.promptTokenCount ?? 0,
          outputTokens: usage?.candidatesTokenCount ?? 0,
        };
      } catch (error: unknown) {
        if (signal?.aborted) {
          throw new TimeoutError();
        }
        const message =
          error instanceof Error ? error.message : String(error);
        const status =
          typeof error === "object" && error !== null && "status" in error
            ? (error as { status?: unknown }).status
            : undefined;
        if (
          status === 402 ||
          status === 429 ||
          /429|402|RESOURCE_EXHAUSTED|quota|prepayment credits/i.test(message)
        ) {
          throw new ProviderQuotaError(message);
        }
        if (/abort/i.test(message)) {
          throw new TimeoutError(message);
        }
        throw error;
      }
    },
  };
}
