import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useFocusTrap } from "./useFocusTrap";

function TrapHarness() {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(true, ref);

  return (
    <div>
      <button type="button">Outside</button>
      <div ref={ref}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </div>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus inside and cycles with Tab", async () => {
    const user = userEvent.setup();
    render(<TrapHarness />);

    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
  });
});
