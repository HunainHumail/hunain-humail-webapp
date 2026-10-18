import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseStudyCard } from "./CaseStudyCard";

describe("CaseStudyCard", () => {
  it("renders title, category, summary, and detail link", () => {
    render(
      <CaseStudyCard
        title="Trinnect"
        categoryLabel="Products"
        summary="AI-native product pipeline."
        href="/work/trinnect"
      />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Trinnect" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("AI-native product pipeline.")).toBeInTheDocument();
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
});
