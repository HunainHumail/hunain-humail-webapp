import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders the correct heading level", () => {
    render(<Heading level={1}>Title</Heading>);
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
  });

  it("supports display and hero sizes", () => {
    const { rerender } = render(
      <Heading level={1} size="display">
        Display
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Display" }).className).toMatch(
      /text-display-hero/,
    );

    rerender(
      <Heading level={2} size="section">
        Section
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Section" }).className).toMatch(
      /text-display-section/,
    );
  });

  it("does not keep the default h1 size on hero headings", () => {
    render(
      <Heading level={1} size="hero">
        Hero
      </Heading>,
    );
    const className = screen.getByRole("heading", { level: 1, name: "Hero" }).className;
    expect(className).toMatch(/text-display-hero/);
    expect(className).not.toMatch(/text-4xl/);
  });
});
