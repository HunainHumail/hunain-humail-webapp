import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

describe("Container", () => {
  it("renders as main landmark when requested", () => {
    render(<Container as="main">Content</Container>);
    expect(screen.getByRole("main")).toHaveTextContent("Content");
  });
});
