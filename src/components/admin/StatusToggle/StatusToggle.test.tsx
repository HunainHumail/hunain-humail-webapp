import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatusToggle } from "./StatusToggle";

describe("StatusToggle", () => {
  it("switches between draft and published", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StatusToggle value="draft" onChange={onChange} />);

    expect(screen.getByText("Draft")).toBeInTheDocument();
    await user.click(screen.getByRole("switch", { name: "Published" }));
    expect(onChange).toHaveBeenCalledWith("published");
  });
});
