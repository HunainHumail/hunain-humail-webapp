import { PROFILE_DOC_ID, profileRepository } from "@/lib/firebase";
import { profileSeed } from "@/lib/seed/profile";
import { profileSchema, type Profile } from "@/lib/schemas/profile";
import { withFirebaseFallback } from "./withFirebaseFallback";

function requirePublished(profile: Profile): Profile {
  if (profile.status !== "published") {
    throw new Error("Profile is not published");
  }
  return profile;
}

export async function getProfile(): Promise<Profile> {
  return withFirebaseFallback(
    async () => {
      const document = await profileRepository.getById(PROFILE_DOC_ID);
      if (!document) {
        throw new Error("Profile document is missing");
      }
      return requirePublished(profileSchema.parse(document));
    },
    () => requirePublished(profileSchema.parse(profileSeed)),
  );
}
