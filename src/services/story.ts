import { isFirebaseConfigured } from "@/lib/env";
import { storySeed } from "@/lib/seed/story";
import { storyItemSchema, type StoryItem } from "@/lib/schemas/story";

export function publishedStoryItems(items: StoryItem[]): StoryItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

export async function getStory(): Promise<StoryItem[]> {
  if (isFirebaseConfigured()) {
    // Repository wiring lands with CMS; seed until then.
  }
  const parsed = storySeed.map((item) => storyItemSchema.parse(item));
  return publishedStoryItems(parsed);
}
