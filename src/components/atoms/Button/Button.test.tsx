import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button with accessible name", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="ghost" size="sm" className="custom">
        Ghost
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Ghost" });
    expect(btn).toHaveClass("custom");
    expect(btn.className).toMatch(/border-border/);
  });
});
