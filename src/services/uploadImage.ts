import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  IMAGE_UPLOAD_FAILED,
  imageFileError,
} from "@/lib/admin/imageFile";
import { isFirebaseStorageEnabled } from "@/lib/env";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { STORAGE_IMAGES_PREFIX } from "@/lib/firebase/constants";

export async function uploadCmsImage(file: File): Promise<string> {
  const problem = imageFileError(file);
  if (problem) {
    throw new Error(problem);
  }
  if (!isFirebaseStorageEnabled()) {
    throw new Error(IMAGE_UPLOAD_FAILED);
  }
  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error(IMAGE_UPLOAD_FAILED);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "") || "image";
  const path = `${STORAGE_IMAGES_PREFIX}/${crypto.randomUUID()}-${safeName}`;
  try {
    const stored = ref(storage, path);
    await uploadBytes(stored, file, { contentType: file.type });
    return await getDownloadURL(stored);
  } catch {
    throw new Error(IMAGE_UPLOAD_FAILED);
  }
}
