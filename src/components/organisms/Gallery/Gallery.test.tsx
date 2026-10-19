import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { WorkGalleryItem } from "@/lib/schemas/work";
import { Gallery } from "./Gallery";

const items: WorkGalleryItem[] = [
  {
    src: "/projects/white-label-vpn-sdk/gallery/aviteovpn-01.webp",
    alt: "AviteoVPN screenshot",
    caption: "AviteoVPN",
  },
  {
    src: "/projects/white-label-vpn-sdk/gallery/digitunnel-vpn-01.webp",
    alt: "Digitunnel VPN screenshot",
    caption: "Digitunnel VPN",
  },
  {
    src: "/projects/white-label-vpn-sdk/gallery/gatewayvpn-01.webp",
    alt: "GatewayVPN screenshot",
    caption: "GatewayVPN",
  },
];

describe("Gallery", () => {
  it("renders a labelled grid of images and captions", () => {
    render(<Gallery items={items} />);

    expect(screen.getByRole("heading", { level: 2, name: "Gallery" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Project gallery" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "AviteoVPN screenshot" })).toHaveAttribute(
      "src",
      items[0]?.src,
    );
    expect(screen.getByText("Digitunnel VPN")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens and closes the lightbox", async () => {
    const user = userEvent.setup();
    render(<Gallery items={items} />);

    await user.click(screen.getByRole("img", { name: "AviteoVPN screenshot" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(within(dialog).getByRole("img", { name: "AviteoVPN screenshot" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close gallery" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Close gallery" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates with arrow keys and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Gallery items={items} />);

    await user.click(screen.getByRole("img", { name: "AviteoVPN screenshot" }));
    expect(
      within(screen.getByRole("dialog")).getByRole("img", {
        name: "AviteoVPN screenshot",
      }),
    ).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(
      within(screen.getByRole("dialog")).getByRole("img", {
        name: "Digitunnel VPN screenshot",
      }),
    ).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(
      within(screen.getByRole("dialog")).getByRole("img", {
        name: "AviteoVPN screenshot",
      }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps keyboard focus inside the lightbox", async () => {
    const user = userEvent.setup();
    render(<Gallery items={items} />);

    await user.click(screen.getByRole("img", { name: "AviteoVPN screenshot" }));
    expect(screen.getByRole("button", { name: "Close gallery" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Previous image" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Next image" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Close gallery" })).toHaveFocus();
  });
});
