import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminDashboard } from "./AdminDashboard";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAdmin: true,
    configured: true,
    error: null,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock("@/services/importSeed", () => ({
  importSeedData: vi.fn(),
  formatSeedImportSummary: vi.fn(),
}));

const countRecentHealthFailures = vi.hoisted(() => vi.fn(async () => 0));

vi.mock("@/services/healthEvents", () => ({
  countRecentHealthFailures: () => countRecentHealthFailures(),
  listHealthEvents: vi.fn(async () => []),
}));

describe("AdminDashboard", () => {
  it("offers the seed import action", () => {
    render(<AdminDashboard />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Import seed data" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /in the last hour/ })).not.toBeInTheDocument();
  });

  it("shows a failure banner when the last hour has failures", async () => {
    countRecentHealthFailures.mockResolvedValueOnce(2);
    render(<AdminDashboard />);
    expect(
      await screen.findByRole("link", { name: "2 failures in the last hour" }),
    ).toHaveAttribute("href", "/admin/health");
  });
});
