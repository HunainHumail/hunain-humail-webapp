import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/templates";
import { getSiteSettings } from "@/services/siteSettings";
import { getWork, getWorkBySlug } from "@/services/work";

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

  if (!item) {
    return { title: "Work" };
  }

  return {
    title: `${item.title} · Hunain Humail`,
    description: item.summary,
  };
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
