"use client";

import { useMemo, useState } from "react";
import type { WritingItem } from "@/lib/schemas/writing";
import {
  filterWritingByType,
  type WritingFilterType,
} from "@/lib/utils/filterWritingByType";

export type { WritingFilterType };

export interface UseWritingFilterResult {
  type: WritingFilterType;
  setType: (type: WritingFilterType) => void;
  filtered: WritingItem[];
}

export function useWritingFilter(
  items: WritingItem[],
): UseWritingFilterResult {
  const [type, setType] = useState<WritingFilterType>("all");
  const filtered = useMemo(
    () => filterWritingByType(items, type),
    [items, type],
  );

  return { type, setType, filtered };
}
