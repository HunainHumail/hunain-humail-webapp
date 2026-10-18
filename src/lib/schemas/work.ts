import { z } from "zod";

export const workCategorySchema = z.enum([
  "ai-systems",
  "products",
  "client-apps",
  "fintech",
]);

export const workLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const workItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  category: workCategorySchema,
  summary: z.string().min(1),
  role: z.string().min(1),
  stack: z.array(z.string().min(1)),
  highlights: z.array(z.string().min(1)),
  body: z.string().min(1),
  coverUrl: z.string().url().optional(),
  links: z.array(workLinkSchema).optional(),
  order: z.number(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  updatedAt: z.string().min(1),
});

export type WorkCategory = z.infer<typeof workCategorySchema>;
export type WorkLink = z.infer<typeof workLinkSchema>;
export type WorkItem = z.infer<typeof workItemSchema>;
