import { HomeTemplate } from "@/components/templates";
import { getProfile } from "@/services/profile";
import { getSiteSettings } from "@/services/siteSettings";
import { getStory } from "@/services/story";

export default async function Home() {
  const [settings, profile, story] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getStory(),
  ]);

  return (
    <HomeTemplate settings={settings} profile={profile} story={story} />
  );
}
