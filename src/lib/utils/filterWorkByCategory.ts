import type { WorkCategory, WorkItem } from "@/lib/schemas/work";

export type WorkFilterCategory = WorkCategory | "all";

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  "ai-systems": "AI systems",
  products: "Products",
  "client-apps": "Client apps",
};

export const WORK_FILTER_TABS: { value: WorkFilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai-systems", label: "AI systems" },
  { value: "products", label: "Products" },
  { value: "client-apps", label: "Client apps" },
];

export function countWorkByCategory(
  items: readonly WorkItem[],
): Record<WorkFilterCategory, number> {
  const counts: Record<WorkFilterCategory, number> = {
    all: items.length,
    "ai-systems": 0,
    products: 0,
    "client-apps": 0,
  };

  for (const item of items) {
    counts[item.category] += 1;
  }

  return counts;
}

export function workFilterTabs(
  items: readonly WorkItem[],
): { value: WorkFilterCategory; label: string }[] {
  const counts = countWorkByCategory(items);
  return WORK_FILTER_TABS.map((tab) => ({
    value: tab.value,
    label: `${tab.label} (${counts[tab.value]})`,
  }));
}

export function filterWorkByCategory(
  items: readonly WorkItem[],
  category: WorkFilterCategory,
): WorkItem[] {
  const next =
    category === "all"
      ? items.slice()
      : items.filter((item) => item.category === category);

  return next.sort((a, b) => a.order - b.order);
}
