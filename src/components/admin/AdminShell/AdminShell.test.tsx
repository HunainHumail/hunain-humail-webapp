import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ADMIN_SECTIONS, AdminShell } from "./AdminShell";

describe("AdminShell", () => {
  it("lists every admin section and starts on Profile", () => {
    render(<AdminShell onSignOut={vi.fn()} />);

    expect(
      screen.getByRole("navigation", { name: "Admin" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Profile" })).toBeInTheDocument();

    for (const section of ADMIN_SECTIONS) {
      expect(screen.getByRole("button", { name: section })).toBeInTheDocument();
    }
  });

  it("switches the dashboard heading from the sidebar", async () => {
    const user = userEvent.setup();
    render(<AdminShell onSignOut={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Settings/SEO" }));

    expect(
      screen.getByRole("heading", { level: 1, name: "Settings/SEO" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Settings/SEO" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("signs out from the sidebar", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(<AdminShell onSignOut={onSignOut} />);

    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
