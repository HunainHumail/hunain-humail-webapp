import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
  .refine(
    (value) => !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime()),
    { message: "date must be a valid calendar day" },
  );

const writingImageSchema = z
  .string()
  .regex(/^\/writing\/[a-z0-9-]+\.webp$/, "image must be /writing/<slug>.webp");

export const linkedinPostSchema = z.object({
  title: z.string().min(1),
  date: isoDateSchema,
  url: z
    .string()
    .url()
    .refine(
      (value) => value.startsWith("https://www.linkedin.com/feed/update/"),
      { message: "url must be a LinkedIn activity permalink" },
    ),
  image: writingImageSchema,
  alt: z.string().min(1),
  excerpt: z.string().min(1).optional(),
});

export const linkedinPostsSchema = z
  .array(linkedinPostSchema)
  .min(1)
  .superRefine((posts, ctx) => {
    for (let index = 1; index < posts.length; index += 1) {
      const newer = posts[index - 1];
      const older = posts[index];
      if (!newer || !older) {
        continue;
      }
      if (older.date > newer.date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "posts must be listed newest first",
          path: [index, "date"],
        });
      }
    }
  });

export type LinkedInPost = z.infer<typeof linkedinPostSchema>;
