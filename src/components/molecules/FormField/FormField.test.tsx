import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/atoms/Input";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("associates the label with the input", () => {
    render(
      <FormField id="email" label="Email">
        <Input type="email" />
      </FormField>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("exposes error text through aria-describedby", () => {
    render(
      <FormField id="email" label="Email" error="Enter a valid email">
        <Input type="email" />
      </FormField>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByText("Enter a valid email")).toHaveAttribute(
      "id",
      "email-error",
    );
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(
      <FormField id="name" label="Name">
        <Input />
      </FormField>,
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    await user.type(input, "Ada");
    expect(input).toHaveValue("Ada");
  });
});
