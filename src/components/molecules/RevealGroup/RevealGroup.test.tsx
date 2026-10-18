import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RevealGroup } from "./RevealGroup";

describe("RevealGroup", () => {
  it("renders children marked for reveal", () => {
    render(
      <RevealGroup>
        <p data-reveal>Card</p>
      </RevealGroup>,
    );
    expect(screen.getByText("Card")).toHaveAttribute("data-reveal");
  });
});
