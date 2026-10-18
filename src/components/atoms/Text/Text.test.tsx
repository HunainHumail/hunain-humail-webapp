import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./Text";

describe("Text", () => {
  it("renders body text", () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies muted variant", () => {
    render(<Text variant="muted">Muted</Text>);
    expect(screen.getByText("Muted").className).toMatch(/text-muted/);
  });
});
