import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { DocForm } from "./DocForm";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  updatedAt: z.string().min(1),
});

const fields = [{ name: "title", label: "Title", type: "text" as const }];

function Harness({
  onSubmit,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>({ title: "" });
  return (
    <DocForm
      fields={fields}
      schema={schema}
      values={values}
      onChange={setValues}
      onSubmit={onSubmit}
    />
  );
}

describe("DocForm", () => {
  it("shows a validation error and skips save when the document is invalid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Title is required");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits a valid document", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox", { name: "Title" }), "Trinnect");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Trinnect" }),
    );
  });
});
