import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { workItemSchema } from "@/lib/schemas/work";
import { workCoverSrc } from "@/lib/utils/workCover";
import { workSeed } from "./work";

const banned = (parts: readonly string[]) => new RegExp(parts.join(""), "i");

const BANNED_PATTERNS = [
  banned(["hy", "sab"]),
  banned(["co", "-", "founder"]),
  banned(["\\b", "ct", "o", "\\b"]),
  /flexihi/i,
  /gastoudertje/i,
  /this or that/i,
  /skystep/i,
  /offer180/i,
  /rakbank/i,
  /open finance project/i,
  /open-finance-project/i,
];

const ALLOWED_SLUGS = [
  "al-rayyan-tv",
  "banoon",
  "boon-and-bliss",
  "bring-itt",
  "coachendo",
  "emdee",
  "escrow-trakker-landlords",
  "escrow-trakker-lawyers",
  "fast-brix",
  "freelance-android",
  "golflinks",
  "grocery",
  "high-end-crypto-demo",
  "innerspark",
  "lions-clubs-connect",
  "luviq",
  "mh1",
  "my-float",
  "omanoil",
  "purevpn",
  "royal-gas",
  "savesor",
  "shopscope",
  "tecobi",
  "terranzo",
  "tickfilm",
  "trinnect",
  "vigil",
  "wellspent",
] as const;

describe("workSeed", () => {
  it("publishes every imported project plus the VPN card", () => {
    const slugs = workSeed.map((item) => item.slug);
    expect(new Set(slugs)).toEqual(
      new Set<string>([...ALLOWED_SLUGS, "white-label-vpn-sdk"]),
    );
    expect(workSeed).toHaveLength(ALLOWED_SLUGS.length + 1);
    expect(workSeed.every((item) => item.status === "published")).toBe(true);
  });

  it("parses every item and keeps slugs unique", () => {
    const slugs = workSeed.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(workSeed.map((item) => item.order)).size).toBe(workSeed.length);

    for (const item of workSeed) {
      expect(() => workItemSchema.parse(item)).not.toThrow();
    }
  });

  it("features the five AI-native apps first", () => {
    const featured = workSeed
      .filter((item) => item.featured)
      .sort((a, b) => a.order - b.order);

    expect(featured.map((item) => item.slug)).toEqual([
      "trinnect",
      "terranzo",
      "my-float",
      "fast-brix",
      "vigil",
    ]);
    expect(featured.every((item) => item.category === "ai-systems")).toBe(true);
    expect(featured.every((item) => item.status === "published")).toBe(true);
  });

  it("names the VPN card White Label VPN SDK and seeds its gallery files", () => {
    const vpn = workSeed.find((item) => item.slug === "white-label-vpn-sdk");
    expect(vpn?.title).toBe("White Label VPN SDK");
    expect(vpn?.coverUrl).toBe("/projects/white-label-vpn-sdk/cover.webp");
    expect(vpn?.gallery).toHaveLength(33);
    expect(vpn?.gallery?.every((item) => item.caption)).toBe(true);
    expect(
      new Set(vpn?.gallery?.map((item) => item.caption)),
    ).toEqual(
      new Set(["AviteoVPN", "Digitunnel VPN", "GatewayVPN", "VpnSec"]),
    );

    for (const shot of vpn?.gallery ?? []) {
      expect(shot.src.startsWith("/projects/white-label-vpn-sdk/gallery/")).toBe(
        true,
      );
      expect(
        existsSync(resolve(process.cwd(), "public", shot.src.slice(1))),
      ).toBe(true);
    }
  });

  it("points every coverUrl at a file in public, including the 2x variant", () => {
    for (const item of workSeed) {
      if (!item.coverUrl) {
        continue;
      }

      expect(item.coverUrl.startsWith("/projects/")).toBe(true);
      expect(
        existsSync(resolve(process.cwd(), "public", item.coverUrl.slice(1))),
      ).toBe(true);
      expect(
        existsSync(
          resolve(
            process.cwd(),
            "public",
            workCoverSrc(item.coverUrl, "2x").slice(1),
          ),
        ),
      ).toBe(true);
    }
  });

  it("does not include banned names or the open-finance placeholder", () => {
    const haystack = JSON.stringify(workSeed);
    for (const pattern of BANNED_PATTERNS) {
      expect(haystack).not.toMatch(pattern);
    }
    expect(workSeed.some((item) => item.slug === "open-finance-project")).toBe(
      false,
    );
  });
});
