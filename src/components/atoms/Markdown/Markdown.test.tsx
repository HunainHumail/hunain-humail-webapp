import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Markdown } from "./Markdown";

describe("Markdown", () => {
  it("renders headings, lists, and links", () => {
    render(
      <Markdown source={"## Title\n\n- Item one\n\n[Site](https://example.com)"} />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Item one")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Site" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not render raw HTML", () => {
    render(<Markdown source={'Hello <img alt="xss" src="x" />'} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });
});
