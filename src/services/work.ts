import { workRepository } from "@/lib/firebase";
import { workItemSchema, type WorkItem } from "@/lib/schemas/work";
import { workSeed } from "@/lib/seed/work";
import { withFirebaseFallback } from "./withFirebaseFallback";

export function publishedWorkItems(items: WorkItem[]): WorkItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

function parseWorkItems(items: unknown[]): WorkItem[] {
  return publishedWorkItems(items.map((item) => workItemSchema.parse(item)));
}

export async function getWork(): Promise<WorkItem[]> {
  return withFirebaseFallback(
    async () => parseWorkItems(await workRepository.listPublished()),
    () => parseWorkItems(workSeed),
  );
}

export async function getWorkBySlug(slug: string): Promise<WorkItem | null> {
  return withFirebaseFallback(
    async () => {
      const document = await workRepository.getBySlug(slug);
      if (!document) {
        return null;
      }
      const parsed = workItemSchema.parse(document);
      return parsed.status === "published" ? parsed : null;
    },
    () =>
      parseWorkItems(workSeed).find((item) => item.slug === slug) ?? null,
  );
}
