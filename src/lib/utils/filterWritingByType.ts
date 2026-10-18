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

export const WRITING_TYPE_ORDER: WritingType[] = ["talk", "award", "post"];

export const WRITING_FILTER_TABS: { value: WritingFilterType; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "talk", label: "Talks" },
    { value: "award", label: "Awards" },
    { value: "post", label: "Posts" },
  ];

export interface WritingTypeGroup {
  type: WritingType;
  label: string;
  items: WritingItem[];
}

export function filterWritingByType(
  items: readonly WritingItem[],
  type: WritingFilterType,
): WritingItem[] {
  const next =
    type === "all"
      ? items.slice()
      : items.filter((item) => item.type === type);

  return next.sort((a, b) => a.order - b.order);
}

export function groupWritingByType(
  items: readonly WritingItem[],
): WritingTypeGroup[] {
  return WRITING_TYPE_ORDER.map((type) => ({
    type,
    label: WRITING_TYPE_GROUP_LABELS[type],
    items: items
      .filter((item) => item.type === type)
      .sort((a, b) => a.order - b.order),
  })).filter((group) => group.items.length > 0);
}
