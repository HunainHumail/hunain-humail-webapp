import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NowCard } from "./NowCard";

describe("NowCard", () => {
  it("renders label, title, and body", () => {
    render(
      <NowCard
        label="Building"
        title="Something new"
        body="Placeholder text."
      />,
    );

    expect(screen.getByText("Building")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Something new" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Placeholder text.")).toBeInTheDocument();
  });
});
