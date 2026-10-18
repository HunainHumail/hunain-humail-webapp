import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { ImportSeedButton } from "./ImportSeedButton";

const importSeedData = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/services/importSeed", () => ({
  importSeedData: () => importSeedData(),
}));

describe("ImportSeedButton", () => {
  beforeEach(() => {
    importSeedData.mockReset();
    importSeedData.mockResolvedValue(undefined);
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
      "Seed data imported.",
    );
  });
});
