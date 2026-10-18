import { HomeTemplate } from "@/components/templates";
import { getProfile } from "@/services/profile";
import { getSiteSettings } from "@/services/siteSettings";
import { getNow } from "@/services/now";
import { getStory } from "@/services/story";
import { getWork } from "@/services/work";
import { getWriting } from "@/services/writing";

export default async function Home() {
  const [settings, profile, story, now, work, writing] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getStory(),
    getNow(),
    getWork(),
    getWriting(),
  ]);

  return (
    <HomeTemplate
      settings={settings}
      profile={profile}
      story={story}
      now={now}
      work={work}
      writing={writing}
    />
  );
}
