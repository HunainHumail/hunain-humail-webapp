import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { workSeed } from "@/lib/seed/work";
import { WorkGrid } from "./WorkGrid";

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

describe("WorkGrid", () => {
  it("renders the work section and case studies", () => {
    render(<WorkGrid items={workSeed} />);

    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Things I've built." }),
    ).toBeInTheDocument();
    expect(document.getElementById("work")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Trinnect" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Case studies" })).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Filter work by category" }),
    ).toBeInTheDocument();
  });

  it("filters cards by category", async () => {
    const user = userEvent.setup();
    render(<WorkGrid items={workSeed} />);

    const filters = screen.getByRole("group", { name: "Filter work by category" });
    await user.click(within(filters).getByRole("button", { name: "Fintech" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "Open finance project" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Trinnect" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Trinnect" }),
    ).toBeInTheDocument();
  });
});
