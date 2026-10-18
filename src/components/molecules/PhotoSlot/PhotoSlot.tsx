import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { imageUnoptimized } from "@/lib/utils/imageUnoptimized";

export interface PhotoSlotProps {
  name: string;
  photoUrl?: string;
  className?: string;
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PhotoSlot({ name, photoUrl, className }: PhotoSlotProps) {
  const initials = initialsFromName(name);

  return (
    <div
      className={cn(
        "relative flex size-avatar shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-elevated",
        className,
      )}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt=""
          fill
          sizes="96px"
          className="object-cover"
          unoptimized={imageUnoptimized()}
          priority
        />
      ) : (
        <span
          className="font-mono text-sm uppercase tracking-wide text-muted"
          aria-hidden
        >
          {initials}
        </span>
      )}
      <span className="sr-only">{name}</span>
    </div>
  );
}
