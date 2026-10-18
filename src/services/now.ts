import { nowRepository } from "@/lib/firebase";
import { nowSeed } from "@/lib/seed/now";
import { nowItemSchema, type NowItem } from "@/lib/schemas/now";
import { withFirebaseFallback } from "./withFirebaseFallback";

export function publishedNowItems(items: NowItem[]): NowItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

function parseNowItems(items: unknown[]): NowItem[] {
  return publishedNowItems(items.map((item) => nowItemSchema.parse(item)));
}

export async function getNow(): Promise<NowItem[]> {
  return withFirebaseFallback(
    async () => parseNowItems(await nowRepository.listPublished()),
    () => parseNowItems(nowSeed),
  );
}
