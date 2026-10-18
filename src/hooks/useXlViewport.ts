"use client";

import { useSyncExternalStore } from "react";

/** Tailwind `xl` — header clock is shown from this width up. */
export const XL_MEDIA_QUERY = "(min-width: 80rem)";

function subscribe(onStoreChange: () => void): () => void {
  const media = window.matchMedia(XL_MEDIA_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(XL_MEDIA_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useXlViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
