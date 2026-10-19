"use client";

import { useEffect, useState } from "react";
import {
  isLiveClientFetchEnabled,
  resolveLiveContent,
  type LiveCollection,
  type LiveDataMap,
} from "@/services/liveContent";

export function useLiveContent<K extends LiveCollection>(
  collection: K,
  initialData: LiveDataMap[K],
): LiveDataMap[K] {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (!isLiveClientFetchEnabled()) {
      return;
    }

    let cancelled = false;
    void resolveLiveContent(collection, initialData).then((next) => {
      if (!cancelled) {
        setData(next);
      }
    });

    return () => {
      cancelled = true;
    };
    // Static HTML payload is the first-render fallback; do not refetch when the
    // parent identity of initialData changes after a live swap.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- collection is the cache key
  }, [collection]);

  return data;
}

export function useClientSeoTitle(title: string): void {
  useEffect(() => {
    if (title.length > 0) {
      document.title = title;
    }
  }, [title]);
}
