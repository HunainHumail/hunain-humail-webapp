import { z } from "zod";
import type { BlueprintErrorKind } from "@/lib/blueprint/errors";

export const blueprintPlatformSchema = z.enum(["mobile", "web"]);
export type BlueprintPlatform = z.infer<typeof blueprintPlatformSchema>;

export const blueprintBlockTypeSchema = z.enum([
  "header",
  "nav",
  "list",
  "card",
  "form",
  "button",
  "image",
  "tabbar",
]);
export type BlueprintBlockType = z.infer<typeof blueprintBlockTypeSchema>;

export const blueprintBlockSchema = z.object({
  type: blueprintBlockTypeSchema,
  label: z.string().trim().min(1).max(40),
  items: z.array(z.string().trim().min(1).max(28)).min(1).max(4).optional(),
  /** @deprecated Prefer `items`. Kept so older drafts still parse. */
  count: z.number().int().min(1).max(6).optional(),
});
export type BlueprintBlock = z.infer<typeof blueprintBlockSchema>;

export const blueprintGenerationBlockSchema = blueprintBlockSchema.superRefine(
  (block, ctx) => {
    if (block.type !== "list" && block.type !== "form") {
      return;
    }
    if (!block.items || block.items.length < 2) {
      ctx.addIssue({
        code: "custom",
        message: "List and form blocks need named items",
        path: ["items"],
      });
    }
  },
);

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blueprintScreenSchema = z.object({
  id: z.string().regex(slugRegex),
  title: z.string().trim().min(1).max(40),
  purpose: z.string().trim().min(1).max(160),
  blocks: z.array(blueprintGenerationBlockSchema).min(1).max(6),
});
export type BlueprintScreen = z.infer<typeof blueprintScreenSchema>;

export const blueprintSpecSchema = z.object({
  appName: z.string().trim().min(1).max(40),
  summary: z.string().trim().min(1).max(300),
  audience: z.string().trim().min(1).max(80),
  mvp: z.string().trim().min(1).max(220),
  assumptions: z.array(z.string().trim().min(1).max(140)).min(2).max(4),
  later: z.array(z.string().trim().min(1).max(120)).min(2).max(4),
  platform: blueprintPlatformSchema,
  screens: z.array(blueprintScreenSchema).min(3).max(4),
  features: z.array(z.string().trim().min(1).max(80)).min(3).max(5),
});
export type BlueprintSpec = z.infer<typeof blueprintSpecSchema>;

export const blueprintRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .email("Enter a valid email"),
  idea: z
    .string()
    .trim()
    .min(10, "Describe your idea in at least 10 characters")
    .max(1000, "Keep it under 1000 characters"),
  platform: blueprintPlatformSchema.default("mobile"),
});
export type BlueprintRequest = z.infer<typeof blueprintRequestSchema>;

export const blueprintLeadStatusSchema = z.enum([
  "new",
  "contacted",
  "archived",
]);
export type BlueprintLeadStatus = z.infer<typeof blueprintLeadStatusSchema>;

export const blueprintGenerationStatusSchema = z.enum(["success", "failed"]);
export type BlueprintGenerationStatus = z.infer<
  typeof blueprintGenerationStatusSchema
>;

export const blueprintErrorCodeSchema = z.enum([
  "invalid-output",
  "timeout",
  "provider-quota",
  "provider-error",
]);
export type BlueprintErrorCode = z.infer<typeof blueprintErrorCodeSchema>;

export const blueprintLeadWriteSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  idea: z.string().trim().min(10).max(1000),
  platform: blueprintPlatformSchema,
  generationStatus: blueprintGenerationStatusSchema,
  spec: blueprintSpecSchema.optional(),
  errorCode: blueprintErrorCodeSchema.optional(),
  modelId: z.string().min(1),
  usage: z.object({
    inputTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
  }),
  ipHash: z.string().min(1),
  status: blueprintLeadStatusSchema.default("new"),
});

export const blueprintLeadSchema = z.object({
  id: z.string().min(1),
  email: z.string().catch(""),
  idea: z.string().catch(""),
  platform: blueprintPlatformSchema.catch("mobile"),
  generationStatus: blueprintGenerationStatusSchema.catch("failed"),
  spec: blueprintSpecSchema.optional().catch(undefined),
  errorCode: blueprintErrorCodeSchema.optional().catch(undefined),
  modelId: z.string().catch(""),
  usage: z
    .object({
      inputTokens: z.number().catch(0),
      outputTokens: z.number().catch(0),
    })
    .catch({ inputTokens: 0, outputTokens: 0 }),
  createdAt: z.string().catch(""),
  ipHash: z.string().catch(""),
  status: blueprintLeadStatusSchema.catch("new"),
  contactMessageId: z.string().optional().catch(undefined),
});
export type BlueprintLead = z.infer<typeof blueprintLeadSchema>;

export const blueprintResponseSchema = z.object({
  leadId: z.string().min(1),
  spec: blueprintSpecSchema,
});
export type BlueprintResponse = z.infer<typeof blueprintResponseSchema>;

export interface ContactPrefill {
  email: string;
  message: string;
  blueprintLeadId: string;
}

export interface BlueprintContent {
  eyebrow: string;
  title: string;
  intro: string;
  consent: string;
  emailLabel: string;
  ideaLabel: string;
  platformLabel: string;
  submitLabel: string;
  loadingLabel: string;
  discussLabel: string;
  copyLabel: string;
  retryLabel: string;
  errors: Record<BlueprintErrorKind, string>;
  examples: [string, string, string];
  sample: BlueprintSpec;
}
