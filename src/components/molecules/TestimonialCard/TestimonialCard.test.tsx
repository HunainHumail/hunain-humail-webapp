import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialCard } from "./TestimonialCard";

describe("TestimonialCard", () => {
  it("renders quote, source, date, and an external source link", () => {
    render(
      <TestimonialCard
        name="Ada Lovelace"
        role="Engineering lead, Analytical Engines"
        sourceLabel="LinkedIn"
        text="Clear thinking on agentic workflows."
        dateLabel="Mar 2026"
        dateTime="2026-03-01"
        href="https://www.linkedin.com/in/ada"
        linkLabel="View on LinkedIn"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(
      screen.getByText("Clear thinking on agentic workflows."),
    ).toBeInTheDocument();
    expect(screen.getByText("Mar 2026")).toHaveAttribute(
      "dateTime",
      "2026-03-01",
    );
    const link = screen.getByRole("link", { name: "View on LinkedIn" });
    expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/ada");
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("img", { name: /stars/i })).not.toBeInTheDocument();
  });

  it("renders stars when a rating is present", () => {
    render(
      <TestimonialCard
        name="Ada Lovelace"
        role="Client"
        sourceLabel="Upwork"
        text="Shipped the agent."
        dateLabel="Mar 2026"
        dateTime="2026-03-01"
        rating={5}
      />,
    );

    expect(
      screen.getByRole("img", { name: "5 out of 5 stars" }),
    ).toBeInTheDocument();
  });
});
