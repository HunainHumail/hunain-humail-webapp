import { z } from "zod";

export const navItemSchema = z.object({
  number: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
});

export const socialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  icon: z.enum(["github", "linkedin", "mail", "x"]),
});

export const contactSettingsSchema = z.object({
  email: z.string().email(),
  intro: z.string().min(1),
  options: z.array(z.string().min(1)).min(1),
});

export const siteSettingsSchema = z.object({
  nav: z.array(navItemSchema).min(1),
  socials: z.array(socialLinkSchema),
  contact: contactSettingsSchema,
});

export type NavItem = z.infer<typeof navItemSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ContactSettings = z.infer<typeof contactSettingsSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
