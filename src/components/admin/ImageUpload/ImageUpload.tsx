"use client";

import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
  imageFileError,
  messageFromUploadError,
} from "@/lib/admin/imageFile";
import { cn } from "@/lib/utils/cn";

export interface ImageUploadProps {
  inputId: string;
  onUpload: (file: File) => Promise<string>;
  onUploaded: (url: string) => void;
  className?: string;
}

export function ImageUpload({
  inputId,
  onUpload,
  onUploaded,
  className,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    const problem = imageFileError(file);
    if (problem) {
      setError(problem);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await onUpload(file);
      onUploaded(url);
    } catch (caught) {
      setError(messageFromUploadError(caught));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={inputId}>Upload image</Label>
      <Input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={uploading}
        onChange={(event) => {
          void onChange(event);
        }}
      />
      {uploading ? <p role="status">Uploading</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
