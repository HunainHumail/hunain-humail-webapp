import { z } from "zod";

export const terminalLineSchema = z.object({
  command: z.string().min(1),
  output: z.string().min(1),
});

export const profileCtaSchema = z.object({
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

export const profileAvatarSchema = z.object({
  src: imageUrlSchema,
  alt: z.string().min(1),
});

export const profileSchema = z.object({
  status: z.enum(["draft", "published"]),
  order: z.number().default(0),
  updatedAt: z.string().min(1),
  name: z.string().min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  photoUrl: z.string().url().optional(),
  avatars: z.array(profileAvatarSchema).default([]),
  chips: z.array(z.string().min(1)).min(1),
  terminalLines: z.array(terminalLineSchema).min(1),
  ctas: z.array(profileCtaSchema).min(1),
});

export type TerminalLine = z.infer<typeof terminalLineSchema>;
export type ProfileCta = z.infer<typeof profileCtaSchema>;
export type ProfileAvatarItem = z.infer<typeof profileAvatarSchema>;
export type Profile = z.infer<typeof profileSchema>;
