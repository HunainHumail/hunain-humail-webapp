import { z } from "zod";

export const nowItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  order: z.number(),
  status: z.enum(["draft", "published"]),
  updatedAt: z.string().min(1),
});

export type NowItem = z.infer<typeof nowItemSchema>;
