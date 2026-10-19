import type { WorkItem } from "@/lib/schemas/work";

export const HOME_WORK_PREVIEW_SLUGS = [
  "trinnect",
  "terranzo",
  "my-float",
  "fast-brix",
  "vigil",
  "wellspent",
  "white-label-vpn-sdk",
  "omanoil",
  "coachendo",
  "shopscope",
  "mh1",
  "royal-gas",
] as const;

export const WORK_INDEX_PAGE_SIZE = 12;

export function homeWorkPreview(items: readonly WorkItem[]): WorkItem[] {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  return HOME_WORK_PREVIEW_SLUGS.flatMap((slug) => {
    const item = bySlug.get(slug);
    return item ? [item] : [];
  });
}
