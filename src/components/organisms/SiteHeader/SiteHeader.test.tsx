import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { siteSettingsSeed } from "@/lib/seed/settings";
import { SiteHeader } from "./SiteHeader";

vi.mock("@/components/molecules/DubaiClock", () => ({
  DubaiClock: () => <span>Dubai clock</span>,
}));

describe("SiteHeader", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders logo and primary nav", () => {
    render(
      <SiteHeader
        settings={{ nav: siteSettingsSeed.nav, seo: siteSettingsSeed.seo }}
      />,
    );
    expect(screen.getByRole("link", { name: /hunain humail home/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /01\s*Story/i })).toBeInTheDocument();
    expect(screen.getAllByText("Dubai clock")).toHaveLength(1);
    expect(
      document.querySelector('nav[aria-label="Primary"]'),
    ).not.toHaveTextContent("Dubai clock");
  });

  it("renders one header clock on wide viewports", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(min-width: 80rem)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <SiteHeader
        settings={{ nav: siteSettingsSeed.nav, seo: siteSettingsSeed.seo }}
      />,
    );

    expect(screen.getAllByText("Dubai clock")).toHaveLength(1);
    expect(
      document.querySelector('nav[aria-label="Mobile primary"]'),
    ).not.toHaveTextContent("Dubai clock");
  });

  it("opens mobile menu", async () => {
    const user = userEvent.setup();
    render(
      <SiteHeader
        settings={{ nav: siteSettingsSeed.nav, seo: siteSettingsSeed.seo }}
      />,
    );
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
