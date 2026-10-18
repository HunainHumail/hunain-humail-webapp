"use client";

import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { isPreviewableImageUrl } from "@/lib/admin/imageFile";
import { cn } from "@/lib/utils/cn";
import { ImageUpload } from "../ImageUpload";

export interface ImageFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  error?: string;
  storageAvailable?: boolean;
  onUpload?: (file: File) => Promise<string>;
  className?: string;
}

export function ImageField({
  id,
  label,
  value,
  onChange,
  description,
  error,
  storageAvailable,
  onUpload,
  className,
}: ImageFieldProps) {
  const storage = useImageUpload();
  const available = storageAvailable ?? storage.available;
  const upload = onUpload ?? storage.upload;
  const errorId = `${id}-error`;
  const showPreview = isPreviewableImageUrl(value);

  return (
    <fieldset className={cn("flex flex-col gap-3", className)}>
      <legend className="font-mono text-xs uppercase tracking-wide text-muted">
        {label}
      </legend>
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>Image URL</Label>
        <Input
          id={id}
          type="text"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </div>
      {showPreview ? (
        // User-supplied CMS URLs are not limited to next/image remote hosts.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt={`${label} preview`}
          className="max-h-48 w-auto rounded-md border border-border"
        />
      ) : null}
      {available ? (
        <ImageUpload
          inputId={`${id}-file`}
          onUpload={upload}
          onUploaded={onChange}
        />
      ) : null}
      {error ? (
        <p id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
