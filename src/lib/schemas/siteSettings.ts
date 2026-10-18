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

export const siteSettingsSchema = z.object({
  nav: z.array(navItemSchema).min(1),
  socials: z.array(socialLinkSchema),
});

export type NavItem = z.infer<typeof navItemSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
