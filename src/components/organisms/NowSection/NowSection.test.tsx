import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { nowSeed } from "@/lib/seed/now";
import { NowSection } from "./NowSection";

describe("NowSection", () => {
  it("renders now section with cards and updated label", () => {
    render(<NowSection items={nowSeed} />);

    expect(screen.getByText("Now")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "This month." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Updated Oct 2026")).toBeInTheDocument();
    expect(document.getElementById("now")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Agentic workflows" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Current focus" })).toBeInTheDocument();
  });
});
