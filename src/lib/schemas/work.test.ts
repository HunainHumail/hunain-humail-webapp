import { describe, expect, it } from "vitest";
import { workItemSchema } from "./work";

const valid = {
  id: "work-trinnect",
  slug: "trinnect",
  title: "Trinnect",
  category: "ai-systems",
  summary: "Summary",
  role: "GenAI engineer",
  stack: ["React"],
  highlights: ["One"],
  body: "Body",
  coverUrl: "/projects/trinnect/cover.webp",
  order: 0,
  status: "published",
  featured: true,
  updatedAt: "2026-10-18T00:00:00.000Z",
};

describe("workItemSchema", () => {
  it("accepts a relative cover path", () => {
    expect(workItemSchema.parse(valid).coverUrl).toBe(
      "/projects/trinnect/cover.webp",
    );
  });

  it("rejects a cover that is not a path or https URL", () => {
    const result = workItemSchema.safeParse({
      ...valid,
      coverUrl: "ftp://example.com/cover.webp",
    });
    expect(result.success).toBe(false);
  });

  it("rejects the removed fintech category", () => {
    const result = workItemSchema.safeParse({
      ...valid,
      category: "fintech",
    });
    expect(result.success).toBe(false);
  });

  it("defaults missing gallery and links so admin parse stays tolerant", () => {
    const parsed = workItemSchema.parse(valid);
    expect(parsed.gallery).toEqual([]);
    expect(parsed.links).toEqual([]);
    expect(parsed.featured).toBe(true);
  });

  it("accepts an optional gallery of image URLs", () => {
    const parsed = workItemSchema.parse({
      ...valid,
      gallery: [
        {
          src: "/projects/white-label-vpn-sdk/gallery/aviteovpn-01.webp",
          alt: "AviteoVPN screenshot",
          caption: "AviteoVPN",
        },
        {
          src: "https://cdn.example/vpn.webp",
          alt: "GatewayVPN screenshot",
        },
      ],
    });

    expect(parsed.gallery).toEqual([
      {
        src: "/projects/white-label-vpn-sdk/gallery/aviteovpn-01.webp",
        alt: "AviteoVPN screenshot",
        caption: "AviteoVPN",
      },
      {
        src: "https://cdn.example/vpn.webp",
        alt: "GatewayVPN screenshot",
      },
    ]);
  });

  it("accepts optional company and period", () => {
    const parsed = workItemSchema.parse({
      ...valid,
      company: "Cubix",
      period: "2021–2023",
    });
    expect(parsed.company).toBe("Cubix");
    expect(parsed.period).toBe("2021–2023");
  });

  it("rejects a gallery image that is not a path or https URL", () => {
    const result = workItemSchema.safeParse({
      ...valid,
      gallery: [{ src: "ftp://example.com/shot.webp", alt: "Shot" }],
    });
    expect(result.success).toBe(false);
  });
});
