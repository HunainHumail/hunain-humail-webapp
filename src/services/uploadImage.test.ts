import { beforeEach, describe, expect, it, vi } from "vitest";
import { IMAGE_UPLOAD_FAILED } from "@/lib/admin/imageFile";

const uploadBytes = vi.fn();
const getDownloadURL = vi.fn();
const getFirebaseStorage = vi.fn();
const isFirebaseStorageEnabled = vi.fn();

vi.mock("firebase/storage", () => ({
  ref: vi.fn(() => ({ path: "images/file" })),
  uploadBytes: (...args: unknown[]) => uploadBytes(...args),
  getDownloadURL: (...args: unknown[]) => getDownloadURL(...args),
}));

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseStorage: () => getFirebaseStorage(),
}));

vi.mock("@/lib/env", () => ({
  isFirebaseStorageEnabled: () => isFirebaseStorageEnabled(),
}));

describe("uploadCmsImage", () => {
  beforeEach(() => {
    uploadBytes.mockReset();
    getDownloadURL.mockReset();
    getFirebaseStorage.mockReset();
    isFirebaseStorageEnabled.mockReset();
    getFirebaseStorage.mockReturnValue({ name: "storage" });
    isFirebaseStorageEnabled.mockReturnValue(true);
  });

  it("returns the download URL after a successful upload", async () => {
    getDownloadURL.mockResolvedValue("https://example.com/cover.png");
    const { uploadCmsImage } = await import("./uploadImage");
    const file = new File(["png"], "cover.png", { type: "image/png" });
    await expect(uploadCmsImage(file)).resolves.toBe(
      "https://example.com/cover.png",
    );
    expect(uploadBytes).toHaveBeenCalledTimes(1);
  });

  it("fails with a friendly message when storage is unavailable", async () => {
    isFirebaseStorageEnabled.mockReturnValue(false);
    const { uploadCmsImage } = await import("./uploadImage");
    const file = new File(["png"], "cover.png", { type: "image/png" });
    await expect(uploadCmsImage(file)).rejects.toThrow(IMAGE_UPLOAD_FAILED);
    expect(uploadBytes).not.toHaveBeenCalled();
  });

  it("keeps the failure friendly when the upload itself throws", async () => {
    uploadBytes.mockRejectedValue(new Error("storage/unknown"));
    const { uploadCmsImage } = await import("./uploadImage");
    const file = new File(["png"], "cover.png", { type: "image/png" });
    await expect(uploadCmsImage(file)).rejects.toThrow(IMAGE_UPLOAD_FAILED);
  });
});
