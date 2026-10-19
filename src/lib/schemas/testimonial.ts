import { z } from "zod";

export const testimonialSourceSchema = z.enum(["linkedin", "upwork"]);

const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || value.startsWith("https://"),
    { message: "image URL must be a site path or https URL" },
  );

function optionalRating(value: unknown): unknown {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : value;
  }
  return value;
}

export const testimonialRatingSchema = z.preprocess(
  optionalRating,
  z.number().int().min(1).max(5).optional(),
);

export const testimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  source: testimonialSourceSchema,
  text: z.string().min(1),
  rating: testimonialRatingSchema,
  date: z.string().min(1),
  avatarUrl: imageUrlSchema.optional(),
  link: z.string().url().optional(),
  order: z.number().default(0),
  status: z.enum(["draft", "published"]),
  updatedAt: z.string().min(1),
});

export type TestimonialSource = z.infer<typeof testimonialSourceSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
