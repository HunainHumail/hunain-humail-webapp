import type { ZodTypeAny } from "zod";
import {
  PROFILE_DOC_ID,
  SETTINGS_DOC_ID,
} from "@/lib/firebase/constants";
import { nowItemSchema } from "@/lib/schemas/now";
import { profileSchema } from "@/lib/schemas/profile";
import { siteSettingsSchema } from "@/lib/schemas/siteSettings";
import { storyItemSchema } from "@/lib/schemas/story";
import { workItemSchema } from "@/lib/schemas/work";
import { writingItemSchema } from "@/lib/schemas/writing";
import type { FieldConfig } from "./fields";

export const ADMIN_COLLECTION_NAMES = [
  "profile",
  "story",
  "now",
  "work",
  "writing",
  "settings",
] as const;

export type AdminCollectionName = (typeof ADMIN_COLLECTION_NAMES)[number];

export interface CollectionConfig {
  name: AdminCollectionName;
  label: string;
  titleField: string;
  addLabel: string;
  singletonId?: string;
  schema: ZodTypeAny;
  fields: readonly FieldConfig[];
  createBlank: () => Record<string, unknown>;
}

const terminalFields = [
  { name: "command", label: "Command", type: "text" },
  { name: "output", label: "Output", type: "text" },
] as const satisfies readonly FieldConfig[];

const ctaFields = [
  { name: "label", label: "Label", type: "text" },
  { name: "href", label: "Link", type: "text" },
] as const satisfies readonly FieldConfig[];

const linkFields = [
  { name: "label", label: "Label", type: "text" },
  { name: "href", label: "URL", type: "url" },
] as const satisfies readonly FieldConfig[];

const galleryFields = [
  { name: "src", label: "Image URL", type: "image" },
  { name: "alt", label: "Alt text", type: "text" },
  { name: "caption", label: "Caption", type: "text", optional: true },
] as const satisfies readonly FieldConfig[];

const navFields = [
  { name: "number", label: "Number", type: "text" },
  { name: "label", label: "Label", type: "text" },
  { name: "href", label: "Link", type: "text" },
] as const satisfies readonly FieldConfig[];

const socialFields = [
  { name: "label", label: "Label", type: "text" },
  { name: "href", label: "URL", type: "url" },
  {
    name: "icon",
    label: "Icon",
    type: "select",
    options: [
      { value: "github", label: "GitHub" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "mail", label: "Email" },
      { value: "x", label: "X" },
    ],
  },
] as const satisfies readonly FieldConfig[];

const profileFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "headline", label: "Headline", type: "textarea" },
  { name: "location", label: "Location", type: "text" },
  {
    name: "photoUrl",
    label: "Photo",
    type: "image",
    optional: true,
    description: "Paste an image URL. Upload appears when Storage is enabled.",
  },
  { name: "chips", label: "Chips", type: "tags" },
  {
    name: "terminalLines",
    label: "Terminal lines",
    type: "records",
    fields: terminalFields,
  },
  { name: "ctas", label: "Calls to action", type: "records", fields: ctaFields },
] as const satisfies readonly FieldConfig[];

const storyFields = [
  { name: "year", label: "Year", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "body", label: "Body", type: "textarea" },
  { name: "tags", label: "Tags", type: "tags" },
] as const satisfies readonly FieldConfig[];

const nowFields = [
  { name: "label", label: "Label", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "body", label: "Body", type: "textarea" },
] as const satisfies readonly FieldConfig[];

const workFields = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "ai-systems", label: "AI systems" },
      { value: "products", label: "Products" },
      { value: "client-apps", label: "Client apps" },
    ],
  },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "role", label: "Role", type: "text" },
  { name: "company", label: "Company", type: "text", optional: true },
  { name: "period", label: "Period", type: "text", optional: true },
  { name: "stack", label: "Stack", type: "tags" },
  { name: "highlights", label: "Highlights", type: "tags" },
  { name: "body", label: "Body", type: "markdown" },
  {
    name: "coverUrl",
    label: "Cover image",
    type: "image",
    optional: true,
    description: "Paste an image URL. Upload appears when Storage is enabled.",
  },
  {
    name: "gallery",
    label: "Gallery",
    type: "records",
    optional: true,
    fields: galleryFields,
    description: "Optional case-study image list. Each item needs a URL and alt text.",
  },
  { name: "links", label: "Links", type: "records", fields: linkFields },
  { name: "featured", label: "Featured", type: "switch" },
] as const satisfies readonly FieldConfig[];

const writingFields = [
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "talk", label: "Talk" },
      { value: "award", label: "Award" },
      { value: "post", label: "Post" },
    ],
  },
  { name: "title", label: "Title", type: "text" },
  { name: "venue", label: "Venue", type: "text" },
  { name: "date", label: "Date", type: "date" },
  { name: "url", label: "URL", type: "url", optional: true },
  { name: "summary", label: "Summary", type: "textarea" },
] as const satisfies readonly FieldConfig[];

const settingsFields = [
  { name: "nav", label: "Navigation", type: "records", fields: navFields },
  { name: "socials", label: "Socials", type: "records", fields: socialFields },
  { name: "contact.email", label: "Contact email", type: "text" },
  { name: "contact.intro", label: "Contact intro", type: "textarea" },
  { name: "contact.options", label: "Contact options", type: "tags" },
  { name: "seo.title", label: "SEO title", type: "text" },
  { name: "seo.description", label: "SEO description", type: "textarea" },
  {
    name: "seo.ogImage",
    label: "OG image",
    type: "image",
    optional: true,
    description: "Paste an image URL. Upload appears when Storage is enabled.",
  },
] as const satisfies readonly FieldConfig[];

function meta(status: "draft" | "published" = "draft"): Record<string, unknown> {
  return { status, order: 0, updatedAt: "" };
}

export const collectionConfigs: Record<AdminCollectionName, CollectionConfig> = {
  profile: {
    name: "profile",
    label: "Profile",
    titleField: "name",
    addLabel: "Add profile",
    singletonId: PROFILE_DOC_ID,
    schema: profileSchema,
    fields: profileFields,
    createBlank: () => ({
      ...meta(),
      name: "",
      headline: "",
      location: "",
      chips: [],
      terminalLines: [{ command: "", output: "" }],
      ctas: [{ label: "", href: "" }],
    }),
  },
  story: {
    name: "story",
    label: "Story",
    titleField: "title",
    addLabel: "Add story entry",
    schema: storyItemSchema,
    fields: storyFields,
    createBlank: () => ({
      id: "",
      year: "",
      title: "",
      body: "",
      tags: [],
      ...meta(),
    }),
  },
  now: {
    name: "now",
    label: "Now",
    titleField: "title",
    addLabel: "Add now item",
    schema: nowItemSchema,
    fields: nowFields,
    createBlank: () => ({
      id: "",
      label: "",
      title: "",
      body: "",
      ...meta(),
    }),
  },
  work: {
    name: "work",
    label: "Work",
    titleField: "title",
    addLabel: "Add work item",
    schema: workItemSchema,
    fields: workFields,
    createBlank: () => ({
      id: "",
      slug: "",
      title: "",
      category: "ai-systems",
      summary: "",
      role: "",
      stack: [],
      highlights: [],
      body: "",
      gallery: [],
      links: [],
      featured: false,
      ...meta(),
    }),
  },
  writing: {
    name: "writing",
    label: "Writing",
    titleField: "title",
    addLabel: "Add writing item",
    schema: writingItemSchema,
    fields: writingFields,
    createBlank: () => ({
      id: "",
      type: "talk",
      title: "",
      venue: "",
      date: "",
      summary: "",
      ...meta(),
    }),
  },
  settings: {
    name: "settings",
    label: "Settings/SEO",
    titleField: "seo.title",
    addLabel: "Add settings",
    singletonId: SETTINGS_DOC_ID,
    schema: siteSettingsSchema,
    fields: settingsFields,
    createBlank: () => ({
      ...meta(),
      nav: [{ number: "", label: "", href: "" }],
      socials: [{ label: "", href: "", icon: "github" }],
      contact: { email: "", intro: "", options: [] },
      seo: { title: "", description: "" },
    }),
  },
};

export function getCollectionConfig(name: AdminCollectionName): CollectionConfig {
  return collectionConfigs[name];
}

export function createDocumentId(collection: AdminCollectionName): string {
  return `${collection}-${crypto.randomUUID()}`;
}
