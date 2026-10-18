import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders badge text", () => {
    render(<Badge status="success">Live</Badge>);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });
});
