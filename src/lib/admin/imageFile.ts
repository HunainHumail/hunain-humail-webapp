import { STORAGE_IMAGE_MAX_BYTES } from "@/lib/firebase/constants";

export const IMAGE_UPLOAD_FAILED =
  "Image upload isn't available. Paste an image URL instead.";

export const IMAGE_TYPE_MESSAGE = "Use a PNG, JPEG, WebP, or GIF image.";

export const IMAGE_SIZE_MESSAGE = "Image must be smaller than 5 MB.";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

export function imageFileError(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return IMAGE_TYPE_MESSAGE;
  }
  if (file.size >= STORAGE_IMAGE_MAX_BYTES) {
    return IMAGE_SIZE_MESSAGE;
  }
  return null;
}

export function messageFromUploadError(error: unknown): string {
  if (
    error instanceof Error &&
    (error.message === IMAGE_UPLOAD_FAILED ||
      error.message === IMAGE_TYPE_MESSAGE ||
      error.message === IMAGE_SIZE_MESSAGE)
  ) {
    return error.message;
  }
  return IMAGE_UPLOAD_FAILED;
}

export function isPreviewableImageUrl(value: string): boolean {
  return (
    value.startsWith("/") ||
    value.startsWith("https://") ||
    value.startsWith("http://")
  );
}
