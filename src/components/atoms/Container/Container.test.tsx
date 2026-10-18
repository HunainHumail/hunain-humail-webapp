import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { layout } from "@/design-system";
import { Container } from "./Container";

describe("Container", () => {
  it("renders as main landmark when requested", () => {
    render(<Container as="main">Content</Container>);
    expect(screen.getByRole("main")).toHaveTextContent("Content");
  });

  it("uses the page max-width and fluid side padding", () => {
    expect(layout.page).toBe("90rem");
    expect(layout.gutter).toBe("clamp(20px, 4vw, 64px)");
    render(<Container>Content</Container>);
    expect(screen.getByText("Content")).toHaveClass(
      "mx-auto",
      "w-full",
      "min-w-0",
      "max-w-page",
      "px-gutter",
    );
  });
});
