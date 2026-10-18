import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/lib/env";
import { siteSettingsSeed } from "@/lib/seed/settings";
import Home, { generateMetadata } from "./page";

vi.mock("lenis", () => ({
  default: class MockLenis {
    on() {
      return undefined;
    }
    raf() {
      return undefined;
    }
    destroy() {
      return undefined;
    }
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: vi.fn() },
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    context: (fn: () => void) => {
      fn();
      return { revert: vi.fn() };
    },
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

describe("Home", () => {
  it("renders the hero inside site shell", async () => {
    const ui = await Home();
    const { container } = render(ui);
    expect(
      screen.getByRole("heading", { level: 1, name: /Hunain\s+Humail/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View work" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Things I've built." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Thinking out loud." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Got something to build?" }),
    ).toBeInTheDocument();
    const jsonLd = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(jsonLd?.textContent).toContain('"@type":"Person"');
    expect(jsonLd?.textContent).toContain('"jobTitle":"GenAI Engineer"');
    expect(jsonLd?.textContent).toContain("https://github.com/hunainhumail");
    expect(jsonLd?.textContent).toContain(
      "https://www.linkedin.com/in/hunain-humail",
    );
    expect(jsonLd?.textContent).toContain("mailto:raohunain@hotmail.com");
    for (const social of siteSettingsSeed.socials) {
      const links = screen.getAllByRole("link", {
        name: new RegExp(social.label, "i"),
      });
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link).toHaveAttribute("href", social.href);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
  });

  it("generateMetadata uses settings SEO and the site url", async () => {
    const metadata = await generateMetadata();
    const siteUrl = getSiteUrl();
    expect(metadata.title).toBe(siteSettingsSeed.seo.title);
    expect(metadata.description).toBe(siteSettingsSeed.seo.description);
    expect(metadata.alternates).toEqual({ canonical: siteUrl });
    expect(metadata.openGraph).toMatchObject({
      title: siteSettingsSeed.seo.title,
      description: siteSettingsSeed.seo.description,
      url: siteUrl,
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: siteSettingsSeed.seo.title,
    });
  });
});
