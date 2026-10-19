"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";
import { CaseStudyTemplate } from "@/components/templates/CaseStudyTemplate";
import { SiteTemplate } from "@/components/templates/SiteTemplate";
import { useClientSeoTitle, useLiveContent } from "@/hooks/useLiveContent";
import type { Profile } from "@/lib/schemas/profile";
import type { SiteSettings } from "@/lib/schemas/siteSettings";
import type { WorkItem } from "@/lib/schemas/work";
import { workSlugFromLocation } from "@/lib/utils/workHref";
import { isLiveClientFetchEnabled } from "@/services/liveContent";

export interface WorkViewLiveProps {
  settings: SiteSettings;
  profile: Profile;
  initialWork: WorkItem[];
}

function subscribeLocation(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
  };
}

function readLocationSlug(): string | null {
  return workSlugFromLocation(
    window.location.pathname,
    window.location.search,
  );
}

function WorkViewShell({
  settings,
  avatars,
  title,
  children,
}: {
  settings: SiteSettings;
  avatars?: Profile["avatars"];
  title: string;
  children?: ReactNode;
}) {
  return (
    <SiteTemplate settings={settings} avatars={avatars}>
      <article className="border-t border-border py-section md:py-section-lg">
        <Container className="max-w-3xl">
          <Link href="/work" className="mb-8 inline-flex text-sm">
            Back to work
          </Link>
          <Heading level={1} size="section" className="mb-4">
            {title}
          </Heading>
          {children}
        </Container>
      </article>
    </SiteTemplate>
  );
}

export function WorkViewLive({
  settings: initialSettings,
  profile: initialProfile,
  initialWork,
}: WorkViewLiveProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromWindow = useSyncExternalStore(
    subscribeLocation,
    readLocationSlug,
    () => null,
  );
  const slug =
    fromWindow ??
    workSlugFromLocation(pathname, searchParams.toString());
  const settings = useLiveContent("settings", initialSettings);
  const profile = useLiveContent("profile", initialProfile);
  const work = useLiveContent("work", initialWork);
  const item = slug
    ? (work.find((entry) => entry.slug === slug) ?? null)
    : null;
  const settled = !isLiveClientFetchEnabled() || work !== initialWork;

  useClientSeoTitle(
    item ? `${item.title} · Hunain Humail` : "Work · Hunain Humail",
  );

  if (item) {
    return (
      <CaseStudyTemplate
        settings={settings}
        item={item}
        avatars={profile.avatars}
      />
    );
  }

  if (settled && slug) {
    return (
      <WorkViewShell
        settings={settings}
        avatars={profile.avatars}
        title="Case study not found"
      >
        <Text variant="muted">That project is not published.</Text>
      </WorkViewShell>
    );
  }

  return (
    <WorkViewShell
      settings={settings}
      avatars={profile.avatars}
      title="Case study"
    >
      <Text variant="muted">Opening project.</Text>
    </WorkViewShell>
  );
}
