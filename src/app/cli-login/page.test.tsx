import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { metadata } from "./page";
import { CliLoginLive } from "./CliLoginLive";

vi.mock("@/hooks/useCliLogin", () => ({
  useCliLogin: () => ({
    status: "confirm",
    code: "AB12CD",
    sessionId: "session-1",
    error: null,
    confirmAndSignIn: vi.fn(),
  }),
}));

describe("cli-login page", () => {
  it("is noindex and renders a single heading", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    render(<CliLoginLive />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Confirm this code" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("User code AB12CD")).toBeInTheDocument();
  });
});
