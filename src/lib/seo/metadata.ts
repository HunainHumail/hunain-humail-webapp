import type { Metadata } from "next";
import type { Seo } from "@/lib/schemas/siteSettings";
import { normalizeSiteUrl } from "./siteUrl";

export interface WorkMetadataInput {
  title: string;
  summary: string;
  slug: string;
}

function absolute(siteUrl: string, path = ""): string {
  const base = normalizeSiteUrl(siteUrl);
  if (!path) {
    return base;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildHomeMetadata(seo: Seo, siteUrl: string): Metadata {
  const canonical = absolute(siteUrl);
  const image = seo.ogImage;

  return {
    metadataBase: new URL(canonical),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: seo.title,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function buildWorkIndexMetadata(siteUrl: string): Metadata {
  const title = "All projects · Hunain Humail";
  const description =
    "Case studies across AI systems, products, and client apps.";
  const canonical = absolute(siteUrl, "/work");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Hunain Humail",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildWorkMetadata(
  item: WorkMetadataInput | null,
  siteUrl: string,
): Metadata {
  if (!item) {
    return { title: "Work" };
  }

  const title = `${item.title} · Hunain Humail`;
  const canonical = absolute(siteUrl, `/work/${item.slug}`);

  return {
    title,
    description: item.summary,
    alternates: { canonical },
    openGraph: {
      title,
      description: item.summary,
      url: canonical,
      siteName: "Hunain Humail",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: item.summary,
    },
  };
}
