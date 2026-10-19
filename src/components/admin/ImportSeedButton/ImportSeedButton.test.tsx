import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { ImportSeedButton } from "./ImportSeedButton";

const importSeedData = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/services/importSeed", () => ({
  importSeedData: () => importSeedData(),
  formatSeedImportSummary: (counts: {
    profile: number;
    story: number;
    now: number;
    work: number;
    writing: number;
    settings: number;
  }) =>
    `Imported profile ${counts.profile}, story ${counts.story}, now ${counts.now}, work ${counts.work}, writing ${counts.writing}, settings ${counts.settings}.`,
}));

describe("ImportSeedButton", () => {
  beforeEach(() => {
    importSeedData.mockReset();
    importSeedData.mockResolvedValue({
      counts: {
        profile: 1,
        story: 4,
        now: 4,
        work: 30,
        writing: 5,
        settings: 1,
      },
      total: 45,
    });
  });

  it("hides the action for a non-admin", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isAdmin: false,
      configured: true,
      error: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    render(<ImportSeedButton />);
    expect(
      screen.queryByRole("button", { name: "Import seed data" }),
    ).not.toBeInTheDocument();
  });

  it("imports seed data after confirmation", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isAdmin: true,
      configured: true,
      error: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    render(<ImportSeedButton />);

    await user.click(screen.getByRole("button", { name: "Import seed data" }));
    expect(importSeedData).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Import" }));

    expect(importSeedData).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Imported profile 1, story 4, now 4, work 30, writing 5, settings 1.",
    );
  });

  it("surfaces import errors", async () => {
    const user = userEvent.setup();
    importSeedData.mockRejectedValueOnce(new Error("Failed to import work (30 docs): permission-denied"));
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isAdmin: true,
      configured: true,
      error: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    render(<ImportSeedButton />);
    await user.click(screen.getByRole("button", { name: "Import seed data" }));
    await user.click(screen.getByRole("button", { name: "Import" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to import work (30 docs): permission-denied",
    );
  });
});
