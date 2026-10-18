import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WritingItem } from "./WritingItem";

const baseProps = {
  dateLabel: "Dec 2023",
  typeLabel: "Talk",
  title: "Speaker",
  venue: "GDG DevFest Sindh 2023",
  summary: "A session on shipping GenAI systems.",
};

describe("WritingItem", () => {
  it("renders mono date/type, title, venue, and summary", () => {
    render(<WritingItem {...baseProps} />);

    expect(screen.getByText("Dec 2023 · Talk")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Speaker" }),
    ).toBeInTheDocument();
    expect(screen.getByText("GDG DevFest Sindh 2023")).toBeInTheDocument();
    expect(
      screen.getByText("A session on shipping GenAI systems."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("wraps the row in a link with an arrow when href is set", () => {
    render(
      <WritingItem
        {...baseProps}
        title="AI-native delivery"
        href="https://www.linkedin.com/in/hunainhumail"
      />,
    );

    const link = screen.getByRole("link", { name: /AI-native delivery/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/hunainhumail",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.querySelector("svg")).not.toBeNull();
  });
});
