import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders site title and social links", () => {
    render(
      <SiteFooter
        settings={{
          socials: siteSettingsSeed.socials,
          seo: siteSettingsSeed.seo,
        }}
      />,
    );
    expect(screen.getByText(siteSettingsSeed.seo.title)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Social links" })).toBeInTheDocument();
    for (const social of siteSettingsSeed.socials) {
      const link = screen.getByRole("link", {
        name: new RegExp(social.label, "i"),
      });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/hunain-humail",
    );
  });
});
