import { siteSettingsSeed } from "@/lib/seed/settings";
import {
  siteSettingsSchema,
  type SiteSettings,
} from "@/lib/schemas/siteSettings";
import { isFirebaseConfigured } from "@/lib/env";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isFirebaseConfigured()) {
    // Repository wiring lands with CMS; seed until then.
  }
  return siteSettingsSchema.parse(siteSettingsSeed);
}
