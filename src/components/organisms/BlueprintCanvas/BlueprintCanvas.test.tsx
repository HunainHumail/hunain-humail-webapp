import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { blueprintSampleSpecMobile } from "@/lib/seed/blueprint";
import { BlueprintCanvas } from "./BlueprintCanvas";

describe("BlueprintCanvas", () => {
  it("shows the MVP scope, assumptions, and later cuts", () => {
    render(
      <BlueprintCanvas spec={blueprintSampleSpecMobile} copyLabel="Copy plan" />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Neighbour Cut" })).toBeInTheDocument();
    expect(screen.getByText(blueprintSampleSpecMobile.mvp)).toBeInTheDocument();
    expect(screen.getByText("Assumptions")).toBeInTheDocument();
    expect(screen.getByText(blueprintSampleSpecMobile.assumptions[0] ?? "")).toBeInTheDocument();
    expect(screen.getByText("Later")).toBeInTheDocument();
    expect(screen.getByText("In-app payment and tips")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(document.querySelector(".w-wireframe")).toBeTruthy();
    expect(document.querySelector(".w-wireframe-web")).toBeNull();
  });

  it("uses the wider frame for a web blueprint", () => {
    render(
      <BlueprintCanvas
        spec={{ ...blueprintSampleSpecMobile, platform: "web" }}
        copyLabel="Copy plan"
      />,
    );

    expect(document.querySelector(".w-wireframe-web")).toBeTruthy();
    expect(document.querySelector(".w-wireframe")).toBeNull();
  });
});
