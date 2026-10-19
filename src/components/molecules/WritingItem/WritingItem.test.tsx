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

  it("renders a LinkedIn post card with image, date, and external permalink", () => {
    const href =
      "https://www.linkedin.com/feed/update/urn:li:activity:7516513022803222528/";
    render(
      <WritingItem
        dateLabel="Oct 2026"
        typeLabel="Post"
        title="OpenAI DevDay Exchange — Community event, Dubai"
        href={href}
        ctaLabel="View on LinkedIn"
        imageSrc="/writing/openai-devday-exchange.webp"
        imageAlt="OpenAI DevDay Exchange community event in Dubai"
      />,
    );

    const link = screen.getByRole("link", {
      name: /OpenAI DevDay Exchange — Community event, Dubai/i,
    });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("Oct 2026 · Post")).toBeInTheDocument();
    expect(screen.getByText("View on LinkedIn")).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "OpenAI DevDay Exchange community event in Dubai",
      }),
    ).toHaveAttribute("src", "/writing/openai-devday-exchange.webp");
    expect(link.querySelector("svg")).not.toBeNull();
  });
});
