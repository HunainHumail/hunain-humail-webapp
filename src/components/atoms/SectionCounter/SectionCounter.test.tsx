import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionCounter } from "./SectionCounter";

describe("SectionCounter", () => {
  it("renders an outlined decorative index", () => {
    render(<SectionCounter value="01" />);
    const counter = screen.getByText("01");
    expect(counter).toHaveAttribute("aria-hidden");
    expect(counter.className).toMatch(/counter-stroke/);
    expect(counter.className).toMatch(/text-display-counter/);
  });
});
