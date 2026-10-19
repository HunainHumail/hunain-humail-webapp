import { z } from "zod";

export const workCategorySchema = z.enum([
  "ai-systems",
  "products",
  "client-apps",
]);

export const workLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || value.startsWith("https://"),
    { message: "image URL must be a site path or https URL" },
  );

export const workGalleryItemSchema = z.object({
  src: imageUrlSchema,
  alt: z.string().min(1),
  caption: z.string().min(1).optional(),
});

export const workItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  category: workCategorySchema,
  summary: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1).optional(),
  period: z.string().min(1).optional(),
  stack: z.array(z.string().min(1)),
  highlights: z.array(z.string().min(1)),
  body: z.string().min(1),
  coverUrl: imageUrlSchema.optional(),
  gallery: z.array(workGalleryItemSchema).optional(),
  links: z.array(workLinkSchema).optional(),
  order: z.number(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  updatedAt: z.string().min(1),
});

export type WorkCategory = z.infer<typeof workCategorySchema>;
export type WorkLink = z.infer<typeof workLinkSchema>;
export type WorkGalleryItem = z.infer<typeof workGalleryItemSchema>;
export type WorkItem = z.infer<typeof workItemSchema>;
