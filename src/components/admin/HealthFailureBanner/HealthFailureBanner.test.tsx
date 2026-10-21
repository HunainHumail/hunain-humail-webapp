import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HealthFailureBanner } from "./HealthFailureBanner";

const count = vi.hoisted(() => ({ value: 0 }));

vi.mock("@/hooks/useHealthFailureCount", () => ({
  useHealthFailureCount: () => count.value,
}));

describe("HealthFailureBanner", () => {
  it("stays hidden when the last hour is clear", () => {
    count.value = 0;
    const { container } = render(<HealthFailureBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("links the failure count to the health page", () => {
    count.value = 1;
    const { rerender } = render(<HealthFailureBanner />);
    expect(screen.getByRole("link", { name: "1 failure in the last hour" })).toHaveAttribute(
      "href",
      "/admin/health",
    );

    count.value = 3;
    rerender(<HealthFailureBanner />);
    expect(screen.getByRole("link", { name: "3 failures in the last hour" })).toHaveAttribute(
      "href",
      "/admin/health",
    );
  });
});
