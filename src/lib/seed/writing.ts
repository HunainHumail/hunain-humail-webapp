import { linkedinPosts } from "@/content/linkedin-posts";
import {
  linkedinPostsSchema,
  type LinkedInPost,
} from "@/lib/schemas/linkedinPost";
import type { WritingItem } from "@/lib/schemas/writing";

const updatedAt = "2026-10-18T00:00:00.000Z";

export const writingSeed: WritingItem[] = [
  {
    id: "writing-devfest-sindh-2023",
    type: "talk",
    title: "Speaker",
    venue: "GDG DevFest Sindh 2023",
    date: "2023-12-16",
    summary:
      "A session at GDG DevFest Sindh on shipping GenAI systems with automated, production-ready pipelines.",
    order: 0,
    status: "published",
    updatedAt,
  },
  {
    id: "writing-google-hackathon-2020",
    type: "award",
    title: "Winner",
    venue: "Google Hackathon 2020",
    date: "2020-08-01",
    summary:
      "Winner of a Google Hackathon — a product sprint that shipped a working prototype under a tight deadline.",
    order: 1,
    status: "published",
    updatedAt,
  },
];

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

export function getLinkedInWritingItems(
  posts: readonly LinkedInPost[] = linkedinPosts,
): WritingItem[] {
  return linkedinPostsToWritingItems(linkedinPostsSchema.parse(posts));
}

export function writingImportItems(
  posts: readonly LinkedInPost[] = linkedinPosts,
): WritingItem[] {
  const rest = writingSeed.filter((item) => item.type !== "post");
  return [...getLinkedInWritingItems(posts), ...rest].map((item, index) => ({
    ...item,
    order: index,
    status: "published",
  }));
}
