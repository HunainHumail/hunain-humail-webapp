import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ADMIN_NAV, AdminShell } from "./AdminShell";

describe("AdminShell", () => {
  it("links to every admin section", () => {
    render(
      <AdminShell pathname="/admin/profile" onSignOut={vi.fn()}>
        <h1>Profile</h1>
      </AdminShell>,
    );

    expect(screen.getByRole("navigation", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Profile" })).toBeInTheDocument();

    for (const item of ADMIN_NAV) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href,
      );
    }
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("marks the current settings page", () => {
    render(
      <AdminShell pathname="/admin/settings" onSignOut={vi.fn()}>
        <h1>Settings/SEO</h1>
      </AdminShell>,
    );

    expect(screen.getByRole("link", { name: "Settings/SEO" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("signs out from the sidebar", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(<AdminShell pathname="/admin" onSignOut={onSignOut} />);

    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
