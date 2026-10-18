import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IMAGE_UPLOAD_FAILED } from "@/lib/admin/imageFile";
import { ImageUpload } from "./ImageUpload";

describe("ImageUpload", () => {
  it("reports a friendly message when upload fails", async () => {
    const user = userEvent.setup();
    const onUploaded = vi.fn();
    render(
      <ImageUpload
        inputId="cover-file"
        onUpload={vi.fn().mockRejectedValue(new Error("storage/unknown"))}
        onUploaded={onUploaded}
      />,
    );

    const file = new File(["png"], "cover.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Upload image"), file);

    expect(await screen.findByRole("alert")).toHaveTextContent(IMAGE_UPLOAD_FAILED);
    expect(onUploaded).not.toHaveBeenCalled();
  });
});
