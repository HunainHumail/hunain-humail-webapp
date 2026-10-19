"use client";

import { useMemo, useState } from "react";
import type { WorkItem } from "@/lib/schemas/work";
import {
  filterWorkByCategory,
  type WorkFilterCategory,
} from "@/lib/utils/filterWorkByCategory";

export type { WorkFilterCategory };

export interface UseWorkFilterResult {
  category: WorkFilterCategory;
  setCategory: (category: WorkFilterCategory) => void;
  filtered: WorkItem[];
  visible: WorkItem[];
  canLoadMore: boolean;
  loadMore: () => void;
}

export function useWorkFilter(
  items: WorkItem[],
  pageSize?: number,
): UseWorkFilterResult {
  const [category, setCategoryState] = useState<WorkFilterCategory>("all");
  const [visibleCount, setVisibleCount] = useState(pageSize ?? items.length);
  const filtered = useMemo(
    () => filterWorkByCategory(items, category),
    [items, category],
  );
  const visible = useMemo(
    () => (pageSize == null ? filtered : filtered.slice(0, visibleCount)),
    [filtered, pageSize, visibleCount],
  );

  const setCategory = (next: WorkFilterCategory) => {
    setCategoryState(next);
    setVisibleCount(pageSize ?? items.length);
  };

  const loadMore = () => {
    if (pageSize == null) {
      return;
    }
    setVisibleCount((count) => count + pageSize);
  };

  return {
    category,
    setCategory,
    filtered,
    visible,
    canLoadMore: pageSize != null && visible.length < filtered.length,
    loadMore,
  };
}
