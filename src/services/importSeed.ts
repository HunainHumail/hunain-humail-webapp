import { isAdmin } from "@/lib/admin";
import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  PROFILE_DOC_ID,
  SETTINGS_DOC_ID,
} from "@/lib/firebase/constants";
import {
  nowRepository,
  profileRepository,
  settingsRepository,
  storyRepository,
  workRepository,
  writingRepository,
} from "@/lib/firebase/repositories";
import { nowSeed } from "@/lib/seed/now";
import { profileSeed } from "@/lib/seed/profile";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { storySeed } from "@/lib/seed/story";
import { workSeed } from "@/lib/seed/work";
import { writingSeed } from "@/lib/seed/writing";

export async function importSeedData(): Promise<void> {
  const user = getFirebaseAuth()?.currentUser ?? null;
  if (!isAdmin(user)) {
    throw new Error("Only the admin can import seed data");
  }

  await profileRepository.upsert(PROFILE_DOC_ID, profileSeed);
  await settingsRepository.upsert(SETTINGS_DOC_ID, siteSettingsSeed);
  await Promise.all([
    ...storySeed.map((item) => storyRepository.upsert(item.id, item)),
    ...nowSeed.map((item) => nowRepository.upsert(item.id, item)),
    ...workSeed.map((item) => workRepository.upsert(item.id, item)),
    ...writingSeed.map((item) => writingRepository.upsert(item.id, item)),
  ]);
}
