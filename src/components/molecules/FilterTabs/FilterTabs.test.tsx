import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterTabs } from "./FilterTabs";

const tabs = [
  { value: "all", label: "All" },
  { value: "products", label: "Products" },
] as const;

describe("FilterTabs", () => {
  it("exposes a labelled group and pressed state", () => {
    render(
      <FilterTabs
        tabs={tabs}
        value="all"
        onChange={() => undefined}
        aria-label="Filter work by category"
      />,
    );

    expect(
      screen.getByRole("group", { name: "Filter work by category" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange with the selected value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterTabs tabs={tabs} value="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(onChange).toHaveBeenCalledWith("products");
  });
});
