import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseStudyCard } from "./CaseStudyCard";

describe("CaseStudyCard", () => {
  it("renders title, category, summary, and detail link", () => {
    render(
      <CaseStudyCard
        title="Trinnect"
        categoryLabel="AI systems"
        summary="Location-based social app."
        href="/work/trinnect"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Trinnect" }),
    ).toBeInTheDocument();
    expect(screen.getByText("AI systems")).toBeInTheDocument();
    expect(screen.getByText("Location-based social app.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Trinnect/i })).toHaveAttribute(
      "href",
      "/work/trinnect",
    );
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("shows a featured badge when featured", () => {
    render(
      <CaseStudyCard
        title="Vigil"
        categoryLabel="AI systems"
        summary="Pipeline case study."
        href="/work/vigil"
        featured
      />,
    );

    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("renders a 4:3 cover image with alt text", () => {
    const { container } = render(
      <CaseStudyCard
        title="Trinnect"
        categoryLabel="AI systems"
        summary="Location-based social app."
        href="/work/trinnect"
        coverUrl="/projects/trinnect/cover.webp"
        coverAlt="Trinnect cover"
      />,
    );

    const image = screen.getByRole("img", { name: "Trinnect cover" });
    expect(image).toHaveAttribute("src", "/projects/trinnect/cover.webp");
    expect(container.querySelector(".aspect-cover")).toBeInTheDocument();
  });
});
