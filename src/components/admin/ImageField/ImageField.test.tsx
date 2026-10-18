import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IMAGE_UPLOAD_FAILED } from "@/lib/admin/imageFile";
import { ImageField } from "./ImageField";

describe("ImageField", () => {
  it("keeps an image URL field and previews a pasted URL", () => {
    render(
      <ImageField
        id="cover"
        label="Cover image"
        value="https://example.com/cover.png"
        onChange={vi.fn()}
        storageAvailable={false}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Image URL" })).toHaveValue(
      "https://example.com/cover.png",
    );
    expect(screen.getByRole("img", { name: "Cover image preview" })).toHaveAttribute(
      "src",
      "https://example.com/cover.png",
    );
    expect(screen.queryByLabelText("Upload image")).not.toBeInTheDocument();
  });

  it("keeps the URL when upload fails", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ImageField
        id="cover"
        label="Cover image"
        value="https://example.com/cover.png"
        onChange={onChange}
        storageAvailable
        onUpload={vi.fn().mockRejectedValue(new Error("storage/unknown"))}
      />,
    );

    const file = new File(["png"], "cover.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Upload image"), file);

    expect(await screen.findByRole("alert")).toHaveTextContent(IMAGE_UPLOAD_FAILED);
    expect(screen.getByRole("textbox", { name: "Image URL" })).toHaveValue(
      "https://example.com/cover.png",
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});
