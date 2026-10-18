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
    expect(screen.getByRole("link", { name: /GitHub/i })).toBeInTheDocument();
  });
});
