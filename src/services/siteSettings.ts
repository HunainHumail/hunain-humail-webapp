import { SETTINGS_DOC_ID, settingsRepository } from "@/lib/firebase";
import { siteSettingsSeed } from "@/lib/seed/settings";
import {
  siteSettingsSchema,
  type SiteSettings,
} from "@/lib/schemas/siteSettings";
import { withFirebaseFallback } from "./withFirebaseFallback";

function requirePublished(settings: SiteSettings): SiteSettings {
  if (settings.status !== "published") {
    throw new Error("Site settings are not published");
  }
  return settings;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return withFirebaseFallback(
    async () => {
      const document = await settingsRepository.getById(SETTINGS_DOC_ID);
      if (!document) {
        throw new Error("Settings document is missing");
      }
      return requirePublished(siteSettingsSchema.parse(document));
    },
    () => requirePublished(siteSettingsSchema.parse(siteSettingsSeed)),
  );
}
