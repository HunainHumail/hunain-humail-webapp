import { describe, expect, it } from "vitest";
import { siteSettingsSeed } from "@/lib/seed/settings";
import {
  buildHomeMetadata,
  buildWorkIndexMetadata,
  buildWorkMetadata,
} from "./metadata";

const siteUrl = "https://hunain.example/";

describe("buildHomeMetadata", () => {
  it("maps settings SEO to title, description, canonical, and social cards", () => {
    const metadata = buildHomeMetadata(siteSettingsSeed.seo, siteUrl);

    expect(metadata.title).toBe("Hunain Humail");
    expect(metadata.description).toBe(
      "GenAI engineer — fintech and open finance.",
    );
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    if (metadata.metadataBase instanceof URL) {
      expect(metadata.metadataBase.origin).toBe("https://hunain.example");
    }
    expect(metadata.alternates).toEqual({
      canonical: "https://hunain.example",
    });
    expect(metadata.openGraph).toMatchObject({
      title: "Hunain Humail",
      description: "GenAI engineer — fintech and open finance.",
      url: "https://hunain.example",
      siteName: "Hunain Humail",
      type: "website",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Hunain Humail",
      description: "GenAI engineer — fintech and open finance.",
    });
  });

  it("includes a configured OG image on Open Graph and Twitter", () => {
    const metadata = buildHomeMetadata(
      {
        ...siteSettingsSeed.seo,
        ogImage: "https://cdn.example/og.png",
      },
      siteUrl,
    );

    expect(metadata.openGraph).toMatchObject({
      images: [{ url: "https://cdn.example/og.png" }],
    });
    expect(metadata.twitter).toMatchObject({
      images: ["https://cdn.example/og.png"],
    });
  });
});

describe("buildWorkIndexMetadata", () => {
  it("points the all-projects page at /work", () => {
    const metadata = buildWorkIndexMetadata(siteUrl);
    expect(metadata.title).toBe("All projects · Hunain Humail");
    expect(metadata.alternates).toEqual({
      canonical: "https://hunain.example/work",
    });
    expect(metadata.openGraph).toMatchObject({
      url: "https://hunain.example/work",
      type: "website",
    });
  });
});

describe("buildWorkMetadata", () => {
  it("uses the case study title, summary, and canonical path", () => {
    const metadata = buildWorkMetadata(
      {
        title: "Trinnect",
        summary: "A location-based social app.",
        slug: "trinnect",
      },
      siteUrl,
    );

    expect(metadata.title).toBe("Trinnect · Hunain Humail");
    expect(metadata.description).toBe("A location-based social app.");
    expect(metadata.alternates).toEqual({
      canonical: "https://hunain.example/work/trinnect",
    });
    expect(metadata.openGraph).toMatchObject({
      url: "https://hunain.example/work/trinnect",
      type: "article",
    });
  });

  it("returns a plain title when the case study is missing", () => {
    expect(buildWorkMetadata(null, siteUrl)).toEqual({ title: "Work" });
  });
});
