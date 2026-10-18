import { isFirebaseConfigured } from "@/lib/env";
import { profileSeed } from "@/lib/seed/profile";
import { profileSchema, type Profile } from "@/lib/schemas/profile";

export async function getProfile(): Promise<Profile> {
  if (isFirebaseConfigured()) {
    // Repository wiring lands with CMS; seed until then.
  }
  const profile = profileSchema.parse(profileSeed);
  if (profile.status !== "published") {
    throw new Error("Profile is not published");
  }
  return profile;
}
