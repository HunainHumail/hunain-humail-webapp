import type { WritingItem, WritingType } from "@/lib/schemas/writing";

export type WritingFilterType = WritingType | "all";

export const WRITING_TYPE_LABELS: Record<WritingType, string> = {
  talk: "Talk",
  award: "Award",
  post: "Post",
};

export const WRITING_TYPE_GROUP_LABELS: Record<WritingType, string> = {
  talk: "Talks",
  award: "Awards",
  post: "Posts",
};

export const WRITING_TYPE_ORDER: WritingType[] = ["post", "talk", "award"];

export const WRITING_FILTER_TABS: { value: WritingFilterType; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "post", label: "Posts" },
    { value: "talk", label: "Talks" },
    { value: "award", label: "Awards" },
  ];

export interface WritingTypeGroup {
  type: WritingType;
  label: string;
  items: WritingItem[];
}

export function compareWritingItems(a: WritingItem, b: WritingItem): number {
  const aPost = a.type === "post";
  const bPost = b.type === "post";
  if (aPost && bPost) {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) {
      return byDate;
    }
    return a.order - b.order;
  }
  if (aPost) {
    return -1;
  }
  if (bPost) {
    return 1;
  }
  return a.order - b.order;
}

export function sortWritingItems(
  items: readonly WritingItem[],
): WritingItem[] {
  return items.slice().sort(compareWritingItems);
}

export function filterWritingByType(
  items: readonly WritingItem[],
  type: WritingFilterType,
): WritingItem[] {
  const next =
    type === "all"
      ? items.slice()
      : items.filter((item) => item.type === type);

  return sortWritingItems(next);
}

export function groupWritingByType(
  items: readonly WritingItem[],
): WritingTypeGroup[] {
  return WRITING_TYPE_ORDER.map((type) => ({
    type,
    label: WRITING_TYPE_GROUP_LABELS[type],
    items: sortWritingItems(items.filter((item) => item.type === type)),
  })).filter((group) => group.items.length > 0);
}
