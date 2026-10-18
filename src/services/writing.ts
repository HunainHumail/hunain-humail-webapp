import { isFirebaseConfigured } from "@/lib/env";
import { writingItemSchema, type WritingItem } from "@/lib/schemas/writing";
import { writingSeed } from "@/lib/seed/writing";

export function publishedWritingItems(items: WritingItem[]): WritingItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

export async function getWriting(): Promise<WritingItem[]> {
  if (isFirebaseConfigured()) {
    // Repository wiring lands with CMS; seed until then.
  }
  const parsed = writingSeed.map((item) => writingItemSchema.parse(item));
  return publishedWritingItems(parsed);
}
