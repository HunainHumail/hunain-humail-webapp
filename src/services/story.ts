import { storyRepository } from "@/lib/firebase";
import { storySeed } from "@/lib/seed/story";
import { storyItemSchema, type StoryItem } from "@/lib/schemas/story";
import { withFirebaseFallback } from "./withFirebaseFallback";

export function publishedStoryItems(items: StoryItem[]): StoryItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

function parseStoryItems(items: unknown[]): StoryItem[] {
  return publishedStoryItems(items.map((item) => storyItemSchema.parse(item)));
}

export async function getStory(): Promise<StoryItem[]> {
  return withFirebaseFallback(
    async () => parseStoryItems(await storyRepository.listPublished()),
    () => parseStoryItems(storySeed),
  );
}
