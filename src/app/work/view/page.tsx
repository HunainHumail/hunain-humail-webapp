import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkViewLive } from "@/app/_live/WorkViewLive";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import { getProfile } from "@/services/profile";
import { getSiteSettings } from "@/services/siteSettings";
import { getWork } from "@/services/work";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Work · Hunain Humail",
    robots: { index: false, follow: true },
  };
}

export default async function WorkViewPage() {
  const [settings, profile, work] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getWork(),
  ]);

  return (
    <Suspense
      fallback={
        <SiteTemplate settings={settings} avatars={profile.avatars}>
          <article className="border-t border-border py-section md:py-section-lg">
            <Container className="max-w-3xl">
              <Link href="/work" className="mb-8 inline-flex text-sm">
                Back to work
              </Link>
              <Heading level={1} size="section" className="mb-4">
                Case study
              </Heading>
              <Text variant="muted">Opening project.</Text>
            </Container>
          </article>
        </SiteTemplate>
      }
    >
      <WorkViewLive
        settings={settings}
        profile={profile}
        initialWork={work}
      />
    </Suspense>
  );
}
