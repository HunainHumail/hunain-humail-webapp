import { isFirebaseConfigured } from "@/lib/env";
import { nowSeed } from "@/lib/seed/now";
import { nowItemSchema, type NowItem } from "@/lib/schemas/now";

export function publishedNowItems(items: NowItem[]): NowItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

export async function getNow(): Promise<NowItem[]> {
  if (isFirebaseConfigured()) {
    // Repository wiring lands with CMS; seed until then.
  }
  const parsed = nowSeed.map((item) => nowItemSchema.parse(item));
  return publishedNowItems(parsed);
}
