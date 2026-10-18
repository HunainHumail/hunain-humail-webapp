import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhotoSlot } from "./PhotoSlot";

describe("PhotoSlot", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows initials when no photo", () => {
    render(<PhotoSlot name="Hunain Humail" />);
    expect(screen.getByText("HH")).toBeInTheDocument();
    expect(screen.getByText("Hunain Humail", { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("renders image when photoUrl is set", () => {
    const { container } = render(
      <PhotoSlot
        name="Hunain Humail"
        photoUrl="https://example.com/photo.jpg"
      />,
    );
    expect(container.querySelector("img")).toBeInTheDocument();
  });
});
