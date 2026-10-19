"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useGalleryLightbox } from "@/hooks/useGalleryLightbox";
import type { WorkGalleryItem } from "@/lib/schemas/work";
import { cn } from "@/lib/utils/cn";
import { imageUnoptimized } from "@/lib/utils/imageUnoptimized";

export interface GalleryProps {
  items: WorkGalleryItem[];
  heading?: string;
  className?: string;
}

export function Gallery({
  items,
  heading = "Gallery",
  className,
}: GalleryProps) {
  const headingId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const { index, isOpen, open, close, next, prev } = useGalleryLightbox(
    items.length,
  );
  const current = index === null ? undefined : items[index];

  useFocusTrap(isOpen, dialogRef);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowRight") {
        next();
      }
      if (event.key === "ArrowLeft") {
        prev();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [close, isOpen, next, prev]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={cn("mt-10", className)} aria-labelledby={headingId}>
      <Heading
        id={headingId}
        level={2}
        className="mb-6 font-mono text-xs font-normal uppercase tracking-wide text-muted"
      >
        {heading}
      </Heading>
      <ul
        className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3"
        aria-label="Project gallery"
      >
        {items.map((item, itemIndex) => (
          <li key={`${item.src}-${itemIndex}`}>
            <figure className="m-0">
              <button
                type="button"
                className="relative block aspect-cover w-full overflow-hidden rounded-xl border border-border bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                onClick={() => open(itemIndex)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-contain"
                  unoptimized={imageUnoptimized()}
                />
              </button>
              {item.caption ? (
                <figcaption>
                  <Text variant="small" className="mt-2">
                    {item.caption}
                  </Text>
                </figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
      {isOpen && current ? (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-6">
          <button
            type="button"
            aria-label="Dismiss gallery"
            className="absolute inset-0 bg-bg/90"
            onClick={close}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="relative z-raised flex h-full w-full max-w-page flex-col items-center justify-center gap-4"
          >
            <div className="absolute right-0 top-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Close gallery"
                onClick={close}
              >
                <Icon name="x" />
              </Button>
            </div>
            <div className="flex w-full items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Previous image"
                onClick={prev}
              >
                <Icon name="arrow" className="-scale-x-100" />
              </Button>
              <div className="relative min-h-0 w-full flex-1">
                <div className="relative mx-auto h-full min-h-96 w-full">
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="(min-width: 768px) 48rem, 100vw"
                    className="object-contain"
                    unoptimized={imageUnoptimized()}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Next image"
                onClick={next}
              >
                <Icon name="arrow" />
              </Button>
            </div>
            {current.caption ? (
              <Text variant="small">{current.caption}</Text>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
