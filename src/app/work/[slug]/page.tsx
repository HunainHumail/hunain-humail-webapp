import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/templates";
import { getSiteUrl } from "@/lib/env";
import { buildWorkMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/services/siteSettings";
import { getWork, getWorkBySlug } from "@/services/work";

export const dynamic = "force-static";
export const dynamicParams = false;

type WorkCaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const items = await getWork();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: WorkCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getWorkBySlug(slug);
  return buildWorkMetadata(item, getSiteUrl());
}

export default async function WorkCaseStudyPage({
  params,
}: WorkCaseStudyPageProps) {
  const { slug } = await params;
  const [settings, item] = await Promise.all([
    getSiteSettings(),
    getWorkBySlug(slug),
  ]);

  if (!item) {
    notFound();
  }

  return <CaseStudyTemplate settings={settings} item={item} />;
}
