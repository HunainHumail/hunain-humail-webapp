import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes", () => {
    expect(cn("text-text", false && "hidden", "block")).toBe("text-text block");
  });

  it("lets display type tokens replace default text sizes", () => {
    expect(cn("text-4xl", "text-display-hero")).toBe("text-display-hero");
    expect(cn("text-2xl", "text-display-section")).toBe("text-display-section");
  });
});
