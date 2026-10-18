import Image from "next/image";
import { cn } from "@/lib/utils/cn";

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
        "relative flex h-48 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-elevated md:h-72 md:w-60",
        className,
      )}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt=""
          fill
          sizes="240px"
          className="object-cover"
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
