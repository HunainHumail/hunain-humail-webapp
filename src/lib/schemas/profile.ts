import { z } from "zod";

export const terminalLineSchema = z.object({
  command: z.string().min(1),
  output: z.string().min(1),
});

export const profileCtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const profileSchema = z.object({
  status: z.enum(["draft", "published"]),
  order: z.number(),
  updatedAt: z.string().min(1),
  name: z.string().min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  photoUrl: z.string().url().optional(),
  chips: z.array(z.string().min(1)).min(1),
  terminalLines: z.array(terminalLineSchema).min(1),
  ctas: z.array(profileCtaSchema).min(1),
});

export type TerminalLine = z.infer<typeof terminalLineSchema>;
export type ProfileCta = z.infer<typeof profileCtaSchema>;
export type Profile = z.infer<typeof profileSchema>;
