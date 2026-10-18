import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders the correct heading level", () => {
    render(<Heading level={1}>Title</Heading>);
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
  });

  it("supports display size", () => {
    render(<Heading level={1} size="display">Display</Heading>);
    const heading = screen.getByRole("heading", { level: 1, name: "Display" });
    expect(heading.className).toMatch(/text-display-xl/);
  });
});
