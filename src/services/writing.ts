import { writingRepository } from "@/lib/firebase";
import { writingItemSchema, type WritingItem } from "@/lib/schemas/writing";
import {
  getLinkedInWritingItems,
  writingSeed,
} from "@/lib/seed/writing";
import { sortWritingItems } from "@/lib/utils/filterWritingByType";
import { rewriteLinkedInInTree } from "@/lib/utils/rewriteLinkedInUrls";
import { listOrSeed, withFirebaseFallback } from "./withFirebaseFallback";

export {
  getLinkedInWritingItems,
  linkedinPostsToWritingItems,
} from "@/lib/seed/writing";

export function mergeLinkedInPosts(items: readonly WritingItem[]): WritingItem[] {
  const rest = items.filter((item) => item.type !== "post");
  return sortWritingItems([...getLinkedInWritingItems(), ...rest]);
}

export function publishedWritingItems(items: WritingItem[]): WritingItem[] {
  return sortWritingItems(items.filter((item) => item.status === "published"));
}

function parseWritingItems(items: unknown[]): WritingItem[] {
  return publishedWritingItems(
    items.map((item) => writingItemSchema.parse(item)),
  );
}

export async function getWriting(): Promise<WritingItem[]> {
  const seed = () => parseWritingItems(writingSeed);
  const items = await withFirebaseFallback(async () => {
    const loaded = parseWritingItems(await writingRepository.listPublished());
    return listOrSeed(loaded, seed());
  }, seed);
  return rewriteLinkedInInTree(mergeLinkedInPosts(items));
}
