import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChipList } from "./ChipList";

describe("ChipList", () => {
  it("renders chips in a list", () => {
    render(<ChipList items={["GenAI Engineer", "Fintech"]} />);
    expect(screen.getByRole("list", { name: /roles and focus/i })).toBeInTheDocument();
    expect(screen.getByText("GenAI Engineer")).toBeInTheDocument();
    expect(screen.getByText("Fintech")).toBeInTheDocument();
  });
});
