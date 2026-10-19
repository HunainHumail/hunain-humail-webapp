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

describe("AdminDashboard", () => {
  it("offers the seed import action", () => {
    render(<AdminDashboard />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Import seed data" }),
    ).toBeInTheDocument();
  });
});
