import type { WorkCategory, WorkItem } from "@/lib/schemas/work";

export type WorkFilterCategory = WorkCategory | "all";

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  "ai-systems": "AI systems",
  products: "Products",
  "client-apps": "Client apps",
  fintech: "Fintech",
};

export const WORK_FILTER_TABS: { value: WorkFilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai-systems", label: "AI systems" },
  { value: "products", label: "Products" },
  { value: "client-apps", label: "Client apps" },
  { value: "fintech", label: "Fintech" },
];

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
