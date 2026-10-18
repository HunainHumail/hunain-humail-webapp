import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./SectionHeader";

describe("SectionHeader", () => {
  it("renders outlined index and title", () => {
    render(
      <SectionHeader
        index="02"
        eyebrow="Now"
        title="This month."
        titleId="now-heading"
      />,
    );

    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Now")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "This month." }),
    ).toHaveAttribute("id", "now-heading");
  });

  it("can render the title as the page heading", () => {
    render(
      <SectionHeader
        index="03"
        eyebrow="Work"
        title="All projects"
        titleId="all-projects-heading"
        headingLevel={1}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "All projects" }),
    ).toHaveAttribute("id", "all-projects-heading");
  });

  it("uses the eyebrow as the heading when no title is given", () => {
    render(
      <SectionHeader index="01" eyebrow="Story" titleId="story-heading" />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Story" }),
    ).toBeInTheDocument();
  });
});
