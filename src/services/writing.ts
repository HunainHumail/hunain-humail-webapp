import { linkedinPosts } from "@/content/linkedin-posts";
import { writingRepository } from "@/lib/firebase";
import {
  linkedinPostsSchema,
  type LinkedInPost,
} from "@/lib/schemas/linkedinPost";
import { writingItemSchema, type WritingItem } from "@/lib/schemas/writing";
import { writingSeed } from "@/lib/seed/writing";
import { sortWritingItems } from "@/lib/utils/filterWritingByType";
import { rewriteLinkedInInTree } from "@/lib/utils/rewriteLinkedInUrls";
import { listOrSeed, withFirebaseFallback } from "./withFirebaseFallback";

function slugFromImage(image: string): string {
  const file = image.split("/").pop() ?? "post";
  return file.replace(/\.webp$/i, "");
}

export function linkedinPostsToWritingItems(
  posts: readonly LinkedInPost[],
): WritingItem[] {
  return [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post, index) => ({
      id: `writing-${slugFromImage(post.image)}`,
      type: "post",
      title: post.title,
      venue: "LinkedIn",
      date: post.date,
      url: post.url,
      summary: post.excerpt ?? `Notes from ${post.title}.`,
      image: post.image,
      imageAlt: post.alt,
      order: index,
      status: "published",
      updatedAt: `${post.date}T00:00:00.000Z`,
    }));
}

export function getLinkedInWritingItems(): WritingItem[] {
  return linkedinPostsToWritingItems(linkedinPostsSchema.parse(linkedinPosts));
}

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
