import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profileSeed } from "@/lib/seed/profile";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders profile hero content and landmarks", () => {
    render(
      <Hero
        name={profileSeed.name}
        headline={profileSeed.headline}
        location={profileSeed.location}
        chips={profileSeed.chips}
        terminalLines={profileSeed.terminalLines}
        ctas={profileSeed.ctas}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Hunain\s+Humail/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(profileSeed.headline)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View work" })).toHaveAttribute(
      "href",
      "#work",
    );
    expect(screen.getByRole("group", { name: "Terminal" })).toBeInTheDocument();
  });
});
