import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("renders decorative icon as hidden from accessibility tree", () => {
    const { container } = render(<Icon name="arrow" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes label when provided", () => {
    const { container } = render(<Icon name="sun" label="Light mode" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "Light mode");
  });
});
