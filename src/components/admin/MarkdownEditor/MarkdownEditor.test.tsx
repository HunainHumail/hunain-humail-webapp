import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MarkdownEditor } from "./MarkdownEditor";

describe("MarkdownEditor", () => {
  it("edits markdown and shows a live preview", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MarkdownEditor
        id="body"
        label="Body"
        value="Hello **world**"
        onChange={onChange}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Body" }), "!");
    expect(onChange).toHaveBeenCalled();

    await user.click(screen.getByRole("tab", { name: "Preview" }));
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();
  });
});
