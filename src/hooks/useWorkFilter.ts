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
}

export function useWorkFilter(items: WorkItem[]): UseWorkFilterResult {
  const [category, setCategory] = useState<WorkFilterCategory>("all");
  const filtered = useMemo(
    () => filterWorkByCategory(items, category),
    [items, category],
  );

  return { category, setCategory, filtered };
}
