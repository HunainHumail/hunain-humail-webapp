import { z } from "zod";

export const writingTypeSchema = z.enum(["talk", "award", "post"]);

export const writingItemSchema = z.object({
  id: z.string().min(1),
  type: writingTypeSchema,
  title: z.string().min(1),
  venue: z.string().min(1),
  date: z.string().min(1),
  url: z.string().url().optional(),
  summary: z.string().min(1),
  image: z.string().min(1).optional(),
  imageAlt: z.string().min(1).optional(),
  order: z.number().default(0),
  status: z.enum(["draft", "published"]),
  updatedAt: z.string().min(1),
});

export type WritingType = z.infer<typeof writingTypeSchema>;
export type WritingItem = z.infer<typeof writingItemSchema>;
