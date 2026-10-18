import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavItem } from "./NavItem";

const item = { number: "01", label: "Story", href: "#story" };

describe("NavItem", () => {
  it("renders numbered nav link", () => {
    render(<NavItem item={item} />);
    const link = screen.getByRole("link", { name: /01\s*Story/i });
    expect(link).toHaveAttribute("href", "#story");
  });
});
