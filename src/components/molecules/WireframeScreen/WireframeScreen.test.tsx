import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { blueprintSampleSpecMobile } from "@/lib/seed/blueprint";
import { WireframeScreen } from "./WireframeScreen";

describe("WireframeScreen", () => {
  it("draws named form fields instead of a generic label", () => {
    const screenSpec = blueprintSampleSpecMobile.screens[2];
    if (!screenSpec) {
      throw new Error("missing confirm screen");
    }

    render(
      <WireframeScreen screen={screenSpec} platform="mobile" index={2} />,
    );

    expect(screen.getByRole("img", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByText("Your name")).toBeInTheDocument();
    expect(screen.queryByText("Field")).not.toBeInTheDocument();
  });
});
