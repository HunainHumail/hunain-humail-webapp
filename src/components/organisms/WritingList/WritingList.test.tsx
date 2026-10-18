import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { writingSeed } from "@/lib/seed/writing";
import { WritingList } from "./WritingList";

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

describe("WritingList", () => {
  it("renders the writing section, groups, and items", () => {
    render(<WritingList items={writingSeed} />);

    expect(screen.getByText("Writing")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Thinking out loud." }),
    ).toBeInTheDocument();
    expect(document.getElementById("writing")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Speaker" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Winner" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Talks" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Awards" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Posts" })).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Filter writing by type" }),
    ).toBeInTheDocument();
  });

  it("filters rows by type", async () => {
    const user = userEvent.setup();
    render(<WritingList items={writingSeed} />);

    const filters = screen.getByRole("group", {
      name: "Filter writing by type",
    });
    await user.click(within(filters).getByRole("button", { name: "Talks" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "Speaker" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Winner" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "AI-native delivery" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Writing and talks" }),
    ).toBeInTheDocument();

    await user.click(within(filters).getByRole("button", { name: "All" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Winner" }),
    ).toBeInTheDocument();
  });
});
