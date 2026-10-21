import { z } from "zod";
import { HEALTH_FIELD_LIMITS } from "@/lib/health/limits";

export const healthEventSourceSchema = z.enum(["client", "server"]);

export const healthEventSchema = z.object({
  id: z.string().min(1),
  source: healthEventSourceSchema,
  type: z.string().min(1).max(HEALTH_FIELD_LIMITS.type),
  code: z.string().max(HEALTH_FIELD_LIMITS.code),
  message: z.string().max(HEALTH_FIELD_LIMITS.message),
  createdAt: z.string().min(1),
  page: z.string().max(HEALTH_FIELD_LIMITS.page).optional(),
  ua: z.string().max(HEALTH_FIELD_LIMITS.ua).optional(),
  sessionId: z.string().max(HEALTH_FIELD_LIMITS.sessionId).optional(),
  leadId: z.string().max(HEALTH_FIELD_LIMITS.leadId).optional(),
});

export type HealthEvent = z.infer<typeof healthEventSchema>;
export type HealthEventSource = z.infer<typeof healthEventSourceSchema>;
