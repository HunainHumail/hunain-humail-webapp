import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MonoLabel } from "./MonoLabel";

describe("MonoLabel", () => {
  it("renders uppercase mono label", () => {
    render(<MonoLabel>Section</MonoLabel>);
    const el = screen.getByText("Section");
    expect(el.className).toMatch(/uppercase/);
    expect(el.className).toMatch(/font-mono/);
  });
});
