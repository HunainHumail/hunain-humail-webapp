import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Testimonial } from "@/lib/schemas/testimonial";
import { Testimonials } from "./Testimonials";

const items: Testimonial[] = [
  {
    id: "t-linkedin",
    name: "Ada Lovelace",
    role: "Engineering lead, Analytical Engines",
    source: "linkedin",
    text: "Clear thinking on agentic workflows.",
    date: "2026-03-01",
    link: "https://www.linkedin.com/in/ada",
    order: 0,
    status: "published",
    updatedAt: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "t-upwork",
    name: "Grace Hopper",
    role: "Program lead, Navy compilers",
    source: "upwork",
    text: "Shipped the agent on time.",
    rating: 5,
    date: "2026-04-12",
    link: "https://www.upwork.com/freelancers/~grace",
    order: 1,
    status: "published",
    updatedAt: "2026-10-18T00:00:00.000Z",
  },
];

describe("Testimonials", () => {
  it("renders quote cards with source badges, stars, and source links", () => {
    render(<Testimonials items={items} />);

    expect(screen.getByText("Testimonials")).toBeInTheDocument();
    expect(screen.getByText("05")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "What clients say." }),
    ).toBeInTheDocument();
    expect(document.getElementById("testimonials")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Testimonials" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Upwork")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "5 out of 5 stars" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View on LinkedIn" }),
    ).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: "View on Upwork" }),
    ).toHaveAttribute(
      "href",
      "https://www.upwork.com/freelancers/~grace",
    );
  });

  it("renders nothing when there are no testimonials", () => {
    const { container } = render(<Testimonials items={[]} />);

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole("heading", { name: "What clients say." }),
    ).not.toBeInTheDocument();
    expect(document.getElementById("testimonials")).toBeNull();
  });
});
