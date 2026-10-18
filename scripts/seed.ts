import { getAdminFirestore } from "../src/lib/firebase/admin";
import {
  COLLECTIONS,
  PROFILE_DOC_ID,
  SETTINGS_DOC_ID,
} from "../src/lib/firebase/constants";
import { nowSeed } from "../src/lib/seed/now";
import { profileSeed } from "../src/lib/seed/profile";
import { siteSettingsSeed } from "../src/lib/seed/settings";
import { storySeed } from "../src/lib/seed/story";
import { workSeed } from "../src/lib/seed/work";
import { writingSeed } from "../src/lib/seed/writing";

async function seed(): Promise<void> {
  const db = getAdminFirestore();

  await db.collection(COLLECTIONS.profile).doc(PROFILE_DOC_ID).set(profileSeed);
  await db
    .collection(COLLECTIONS.settings)
    .doc(SETTINGS_DOC_ID)
    .set(siteSettingsSeed);

  for (const item of storySeed) {
    await db.collection(COLLECTIONS.story).doc(item.id).set(item);
  }
  for (const item of nowSeed) {
    await db.collection(COLLECTIONS.now).doc(item.id).set(item);
  }
  for (const item of workSeed) {
    await db.collection(COLLECTIONS.work).doc(item.id).set(item);
  }
  for (const item of writingSeed) {
    await db.collection(COLLECTIONS.writing).doc(item.id).set(item);
  }

  process.stdout.write("Seed complete.\n");
}

seed().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
