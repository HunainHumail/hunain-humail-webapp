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

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogImage: z.string().url().optional(),
});

export const siteSettingsSchema = z.object({
  status: z.enum(["draft", "published"]),
  order: z.number().default(0),
  updatedAt: z.string().min(1),
  nav: z.array(navItemSchema).min(1),
  socials: z.array(socialLinkSchema).default([]),
  contact: contactSettingsSchema,
  seo: seoSchema,
});

export type NavItem = z.infer<typeof navItemSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ContactSettings = z.infer<typeof contactSettingsSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
