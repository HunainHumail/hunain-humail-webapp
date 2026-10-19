"use client";

import { useCallback, useState } from "react";

export interface UseGalleryLightboxResult {
  index: number | null;
  isOpen: boolean;
  open: (index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

export function useGalleryLightbox(count: number): UseGalleryLightboxResult {
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
  }, []);

  const next = useCallback(() => {
    if (count < 1) {
      return;
    }
    setIndex((current) => {
      if (current === null) {
        return current;
      }
      return (current + 1) % count;
    });
  }, [count]);

  const prev = useCallback(() => {
    if (count < 1) {
      return;
    }
    setIndex((current) => {
      if (current === null) {
        return current;
      }
      return (current - 1 + count) % count;
    });
  }, [count]);

  return {
    index,
    isOpen: index !== null,
    open,
    close,
    next,
    prev,
  };
}
