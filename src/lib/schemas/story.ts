import { z } from "zod";

export const storyItemSchema = z.object({
  id: z.string().min(1),
  year: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  tags: z.array(z.string().min(1)),
  order: z.number(),
  status: z.enum(["draft", "published"]),
  updatedAt: z.string().min(1),
});

export type StoryItem = z.infer<typeof storyItemSchema>;
