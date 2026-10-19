import type { LiveCollection } from "./liveContent";

export async function fetchLivePublished(
  collection: LiveCollection,
): Promise<unknown> {
  const {
    PROFILE_DOC_ID,
    SETTINGS_DOC_ID,
    nowRepository,
    profileRepository,
    settingsRepository,
    storyRepository,
    testimonialsRepository,
    workRepository,
    writingRepository,
  } = await import("@/lib/firebase");

  switch (collection) {
    case "profile":
      return profileRepository.getById(PROFILE_DOC_ID);
    case "settings":
      return settingsRepository.getById(SETTINGS_DOC_ID);
    case "story":
      return storyRepository.listPublished();
    case "now":
      return nowRepository.listPublished();
    case "work":
      return workRepository.listPublished();
    case "writing":
      return writingRepository.listPublished();
    case "testimonials":
      return testimonialsRepository.listPublished();
  }
}
