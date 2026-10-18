import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { toRecord } from "@/lib/admin/record";
import { storySeed } from "@/lib/seed/story";
import { EditorForm } from "./EditorForm";

describe("EditorForm", () => {
  it("blocks save when a required field is cleared", async () => {
    const story = storySeed[0];
    if (!story) {
      throw new Error("Missing story seed");
    }
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <EditorForm
        collection="story"
        initial={toRecord(story)}
        onSave={onSave}
      />,
    );

    await user.clear(screen.getByRole("textbox", { name: "Title" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
