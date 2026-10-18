import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders copyright and social links", () => {
    render(<SiteFooter settings={{ socials: siteSettingsSeed.socials }} />);
    expect(screen.getByText(/© \d{4} Hunain Humail/)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Social links" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/i })).toBeInTheDocument();
  });
});
