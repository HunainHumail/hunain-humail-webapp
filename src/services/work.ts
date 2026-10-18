import { isFirebaseConfigured } from "@/lib/env";
import { workItemSchema, type WorkItem } from "@/lib/schemas/work";
import { workSeed } from "@/lib/seed/work";

export function publishedWorkItems(items: WorkItem[]): WorkItem[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

export async function getWork(): Promise<WorkItem[]> {
  if (isFirebaseConfigured()) {
    // Repository wiring lands with CMS; seed until then.
  }
  const parsed = workSeed.map((item) => workItemSchema.parse(item));
  return publishedWorkItems(parsed);
}

export async function getWorkBySlug(slug: string): Promise<WorkItem | null> {
  const items = await getWork();
  return items.find((item) => item.slug === slug) ?? null;
}
