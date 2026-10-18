import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimelineItem } from "./TimelineItem";

describe("TimelineItem", () => {
  it("renders year, title, body, and tags", () => {
    render(
      <TimelineItem
        indexLabel="01"
        year="2017"
        title="Android freelancer"
        body="First apps and clients."
        tags={["Android", "Mobile"]}
      />,
    );

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Android freelancer" })).toBeInTheDocument();
    expect(screen.getByText("First apps and clients.")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Topics" })).toBeInTheDocument();
    expect(screen.getByText("Android")).toBeInTheDocument();
  });
});
