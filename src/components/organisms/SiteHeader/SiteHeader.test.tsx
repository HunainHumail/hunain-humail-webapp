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
    render(<SiteHeader settings={{ nav: siteSettingsSeed.nav }} />);
    expect(screen.getByRole("link", { name: /hunain humail home/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /01\s*Story/i })).toBeInTheDocument();
  });

  it("opens mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader settings={{ nav: siteSettingsSeed.nav }} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
