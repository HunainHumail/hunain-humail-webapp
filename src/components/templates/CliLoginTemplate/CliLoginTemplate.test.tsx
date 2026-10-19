import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CliLoginTemplate } from "./CliLoginTemplate";

describe("CliLoginTemplate", () => {
  it("renders the CLI login landmark", () => {
    render(
      <CliLoginTemplate
        status="confirm"
        code="AB12CD"
        error={null}
        onConfirm={() => undefined}
      />,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Confirm this code" }),
    ).toBeInTheDocument();
  });
});
