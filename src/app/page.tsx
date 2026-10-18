import { HomeTemplate } from "@/components/templates";
import { getProfile } from "@/services/profile";
import { getSiteSettings } from "@/services/siteSettings";

export default async function Home() {
  const [settings, profile] = await Promise.all([
    getSiteSettings(),
    getProfile(),
  ]);

  return <HomeTemplate settings={settings} profile={profile} />;
}
