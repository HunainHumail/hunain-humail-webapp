"use client";

import Image from "next/image";
import { useState } from "react";
import { useAvatarFlip } from "@/hooks/useAvatarFlip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ProfileAvatarItem } from "@/lib/schemas/profile";
import { cn } from "@/lib/utils/cn";
import { imageUnoptimized } from "@/lib/utils/imageUnoptimized";

export interface ProfileAvatarProps {
  images: readonly ProfileAvatarItem[];
  size?: "sm" | "lg";
  className?: string;
}

const SIZE_CLASS = {
  sm: "size-avatar-sm",
  lg: "size-avatar-lg",
} as const;

const SIZES_ATTR = {
  sm: "32px",
  lg: "(min-width: 48rem) 200px, 160px",
} as const;

export function ProfileAvatar({
  images,
  size = "lg",
  className,
}: ProfileAvatarProps) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const { flipped, frontIndex, backIndex, canFlip } = useAvatarFlip(
    images.length,
    { reducedMotion, paused },
  );

  const first = images[0];
  if (!first) {
    return null;
  }

  const front = images[frontIndex] ?? first;
  const back = images[backIndex] ?? first;

  return (
    <div
      className={cn(
        "box-border shrink-0 rounded-full bg-ring-gradient p-avatar-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        SIZE_CLASS[size],
        className,
      )}
      tabIndex={canFlip ? 0 : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="size-full rounded-full bg-bg p-avatar-gap">
        {canFlip ? (
          <div className="avatar-flip-scene size-full">
            <div
              className={cn(
                "avatar-flip-card relative size-full",
                flipped && "is-flipped",
              )}
            >
              <div
                className="avatar-flip-face absolute inset-0 overflow-hidden rounded-full"
                aria-hidden={flipped}
              >
                <div className="relative size-full">
                  <Image
                    src={front.src}
                    alt={flipped ? "" : front.alt}
                    fill
                    sizes={SIZES_ATTR[size]}
                    className="object-cover"
                    unoptimized={imageUnoptimized()}
                    preload={size === "lg"}
                  />
                </div>
              </div>
              <div
                className="avatar-flip-face avatar-flip-face-back absolute inset-0 overflow-hidden rounded-full"
                aria-hidden={!flipped}
              >
                <div className="relative size-full">
                  <Image
                    src={back.src}
                    alt={flipped ? back.alt : ""}
                    fill
                    sizes={SIZES_ATTR[size]}
                    className="object-cover"
                    unoptimized={imageUnoptimized()}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative size-full overflow-hidden rounded-full">
            <Image
              src={first.src}
              alt={first.alt}
              fill
              sizes={SIZES_ATTR[size]}
              className="object-cover"
              unoptimized={imageUnoptimized()}
              preload={size === "lg"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
