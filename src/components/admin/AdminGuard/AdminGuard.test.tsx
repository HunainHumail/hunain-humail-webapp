import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "firebase/auth";
import { ADMIN_EMAIL } from "@/lib/admin";
import { useAuth } from "@/hooks/useAuth";
import { AdminGuard } from "./AdminGuard";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

function mockAuth(overrides: Partial<ReturnType<typeof useAuth>> = {}) {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    loading: false,
    isAdmin: false,
    configured: true,
    error: null,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    ...overrides,
  });
}

describe("AdminGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a Firebase not configured notice", () => {
    mockAuth({ configured: false });
    render(<AdminGuard />);

    expect(
      screen.getByRole("heading", { name: "Firebase not configured" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign in with Google" }),
    ).not.toBeInTheDocument();
  });

  it("shows a checking status while auth is loading", () => {
    mockAuth({ loading: true });
    render(<AdminGuard />);

    expect(screen.getByRole("status")).toHaveTextContent("Checking access");
    expect(
      screen.queryByRole("button", { name: "Sign in with Google" }),
    ).not.toBeInTheDocument();
  });

  it("offers Google sign-in when signed out", async () => {
    const user = userEvent.setup();
    const signInWithGoogle = vi.fn();
    mockAuth({ signInWithGoogle });
    render(<AdminGuard />);

    await user.click(
      screen.getByRole("button", { name: "Sign in with Google" }),
    );
    expect(signInWithGoogle).toHaveBeenCalledOnce();
  });

  it("shows an alert when sign-in fails", () => {
    mockAuth({ error: "Could not sign in with Google." });
    render(<AdminGuard />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not sign in with Google.",
    );
  });

  it("denies access and can sign out a non-admin", async () => {
    const user = userEvent.setup();
    const signOut = vi.fn();
    mockAuth({
      user: { email: "guest@example.com", emailVerified: true } as User,
      isAdmin: false,
      signOut,
    });
    render(<AdminGuard />);

    expect(
      screen.getByRole("heading", { name: "Access denied" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("shows the dashboard shell for the admin", () => {
    mockAuth({
      user: { email: ADMIN_EMAIL, emailVerified: true } as User,
      isAdmin: true,
    });
    render(<AdminGuard />);

    expect(screen.getByRole("navigation", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Messages" })).toHaveAttribute(
      "href",
      "/admin/messages",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
