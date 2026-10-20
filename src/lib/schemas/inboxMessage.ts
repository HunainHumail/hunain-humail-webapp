import { z } from "zod";

export const inboxMessageSchema = z.object({
  id: z.string().min(1),
  name: z.string().catch(""),
  email: z.string().catch(""),
  topic: z.string().catch(""),
  message: z.string().catch(""),
  createdAt: z.string().catch(""),
  read: z.boolean().catch(false),
  blueprintLeadId: z.string().min(1).optional().catch(undefined),
});

export type InboxMessage = z.infer<typeof inboxMessageSchema>;
