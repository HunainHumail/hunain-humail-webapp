import { workRepository } from "@/lib/firebase";
import { workItemSchema, type WorkItem } from "@/lib/schemas/work";
import { workSeed } from "@/lib/seed/work";
import { rewriteLinkedInInTree } from "@/lib/utils/rewriteLinkedInUrls";
import { listOrSeed, withFirebaseFallback } from "./withFirebaseFallback";

export function publishedWorkItems(items: WorkItem[]): WorkItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

function parseWorkItems(items: unknown[]): WorkItem[] {
  return publishedWorkItems(items.map((item) => workItemSchema.parse(item)));
}

export async function getWork(): Promise<WorkItem[]> {
  const seed = () => parseWorkItems(workSeed);
  const items = await withFirebaseFallback(async () => {
    const loaded = parseWorkItems(await workRepository.listPublished());
    return listOrSeed(loaded, seed());
  }, seed);
  return rewriteLinkedInInTree(items);
}

export async function getWorkBySlug(slug: string): Promise<WorkItem | null> {
  return withFirebaseFallback(
    async () => {
      const document = await workRepository.getBySlug(slug);
      if (!document) {
        throw new Error(`Work slug not found: ${slug}`);
      }
      const parsed = workItemSchema.parse(document);
      if (parsed.status !== "published") {
        return null;
      }
      return rewriteLinkedInInTree(parsed);
    },
    () => {
      const item =
        parseWorkItems(workSeed).find((entry) => entry.slug === slug) ?? null;
      return item ? rewriteLinkedInInTree(item) : null;
    },
  );
}
