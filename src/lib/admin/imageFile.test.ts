import { describe, expect, it } from "vitest";
import { STORAGE_IMAGE_MAX_BYTES } from "@/lib/firebase/constants";
import {
  IMAGE_SIZE_MESSAGE,
  IMAGE_TYPE_MESSAGE,
  IMAGE_UPLOAD_FAILED,
  imageFileError,
  isPreviewableImageUrl,
  messageFromUploadError,
} from "./imageFile";

describe("image file checks", () => {
  it("accepts a small png and previewable urls", () => {
    const file = new File(["png"], "cover.png", { type: "image/png" });
    expect(imageFileError(file)).toBeNull();
    expect(isPreviewableImageUrl("/projects/trinnect/cover.webp")).toBe(true);
    expect(isPreviewableImageUrl("https://example.com/a.png")).toBe(true);
    expect(isPreviewableImageUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects the wrong type, oversized files, and unknown upload errors", () => {
    const text = new File(["hi"], "notes.txt", { type: "text/plain" });
    expect(imageFileError(text)).toBe(IMAGE_TYPE_MESSAGE);

    const huge = new File([new Uint8Array(STORAGE_IMAGE_MAX_BYTES)], "big.png", {
      type: "image/png",
    });
    expect(imageFileError(huge)).toBe(IMAGE_SIZE_MESSAGE);
    expect(messageFromUploadError(new Error("storage/unknown"))).toBe(
      IMAGE_UPLOAD_FAILED,
    );
  });
});
