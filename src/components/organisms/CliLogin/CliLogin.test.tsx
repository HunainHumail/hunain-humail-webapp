import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CliLogin } from "./CliLogin";

describe("CliLogin", () => {
  it("asks the user to confirm the terminal code", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <CliLogin
        status="confirm"
        code="AB12CD"
        error={null}
        onConfirm={onConfirm}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Confirm this code" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("User code AB12CD")).toHaveTextContent(
      "AB12CD",
    );
    await user.click(
      screen.getByRole("button", { name: "Code matches — continue with Google" }),
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows the done state for the terminal hand-off", () => {
    render(
      <CliLogin
        status="done"
        code="AB12CD"
        error={null}
        onConfirm={() => undefined}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Done — return to the terminal",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "The terminal can finish login",
    );
  });

  it("surfaces authorization errors", () => {
    render(
      <CliLogin
        status="error"
        code="AB12CD"
        error="Only the admin can authorize the CMS CLI"
        onConfirm={() => undefined}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Only the admin can authorize the CMS CLI",
    );
  });
});
