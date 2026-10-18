"use client";

import { useCallback } from "react";
import { isFirebaseStorageEnabled } from "@/lib/env";
import { uploadCmsImage } from "@/services/uploadImage";

export function useImageUpload(): {
  available: boolean;
  upload: (file: File) => Promise<string>;
} {
  const available = isFirebaseStorageEnabled();
  const upload = useCallback((file: File) => uploadCmsImage(file), []);
  return { available, upload };
}
