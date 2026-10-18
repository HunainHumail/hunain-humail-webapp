import { writingRepository } from "@/lib/firebase";
import { writingItemSchema, type WritingItem } from "@/lib/schemas/writing";
import { writingSeed } from "@/lib/seed/writing";
import { withFirebaseFallback } from "./withFirebaseFallback";

export function publishedWritingItems(items: WritingItem[]): WritingItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

function parseWritingItems(items: unknown[]): WritingItem[] {
  return publishedWritingItems(
    items.map((item) => writingItemSchema.parse(item)),
  );
}

export async function getWriting(): Promise<WritingItem[]> {
  return withFirebaseFallback(
    async () => parseWritingItems(await writingRepository.listPublished()),
    () => parseWritingItems(writingSeed),
  );
}
