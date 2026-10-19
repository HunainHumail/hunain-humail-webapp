import { isFirebaseConfigured } from "@/lib/env";
import { nowItemSchema, type NowItem } from "@/lib/schemas/now";
import { profileSchema, type Profile } from "@/lib/schemas/profile";
import {
  siteSettingsSchema,
  type SiteSettings,
} from "@/lib/schemas/siteSettings";
import { storyItemSchema, type StoryItem } from "@/lib/schemas/story";
import { workItemSchema, type WorkItem } from "@/lib/schemas/work";
import { writingItemSchema, type WritingItem } from "@/lib/schemas/writing";
import { sortWritingItems } from "@/lib/utils/filterWritingByType";
import { rewriteLinkedInInTree } from "@/lib/utils/rewriteLinkedInUrls";

export const LIVE_CONTENT_TIMEOUT_MS = 4000;

export type LiveCollection =
  | "profile"
  | "settings"
  | "story"
  | "now"
  | "work"
  | "writing";

export interface LiveDataMap {
  profile: Profile;
  settings: SiteSettings;
  story: StoryItem[];
  now: NowItem[];
  work: WorkItem[];
  writing: WritingItem[];
}

const inflight = new Map<LiveCollection, Promise<unknown>>();

export function resetLiveContentCache(): void {
  inflight.clear();
}

export function isLiveClientFetchEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (process.env.VITEST === "true") {
    return false;
  }
  return isFirebaseConfigured();
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error("Live content timed out"));
        }, ms);
      }),
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

function publishedOnly<T extends { status: string; order: number }>(
  items: T[],
): T[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

function parsePublishedList<T extends { status: string; order: number }>(
  live: unknown,
  parse: (item: unknown) => T,
): T[] {
  if (!Array.isArray(live) || live.length === 0) {
    return [];
  }
  const parsed: T[] = [];
  for (const item of live) {
    try {
      parsed.push(parse(item));
    } catch {
      // Skip invalid CMS documents instead of blanking the section.
    }
  }
  return publishedOnly(parsed);
}

function mergePublishedWork(
  loaded: readonly WorkItem[],
  seed: readonly WorkItem[],
): WorkItem[] {
  const bySlug = new Map<string, WorkItem>();
  for (const item of seed) {
    bySlug.set(item.slug, item);
  }
  for (const item of loaded) {
    bySlug.set(item.slug, item);
  }
  return [...bySlug.values()].sort((a, b) => a.order - b.order);
}

function mergeById<T extends { id: string }>(
  initial: readonly T[],
  live: readonly T[],
): T[] {
  if (live.length === 0) {
    return [...initial];
  }
  const byId = new Map<string, T>();
  for (const item of initial) {
    byId.set(item.id, item);
  }
  for (const item of live) {
    byId.set(item.id, item);
  }
  return [...byId.values()];
}

export function mergeLiveContent<K extends LiveCollection>(
  collection: K,
  initialData: LiveDataMap[K],
  live: unknown,
): LiveDataMap[K] {
  switch (collection) {
    case "profile": {
      const parsed = profileSchema.safeParse(live);
      if (!parsed.success || parsed.data.status !== "published") {
        return initialData;
      }
      return parsed.data as LiveDataMap[K];
    }
    case "settings": {
      const parsed = siteSettingsSchema.safeParse(live);
      if (!parsed.success || parsed.data.status !== "published") {
        return initialData;
      }
      return rewriteLinkedInInTree(parsed.data) as LiveDataMap[K];
    }
    case "story": {
      const liveItems = parsePublishedList(live, (item) =>
        storyItemSchema.parse(item),
      );
      return mergeById(initialData as StoryItem[], liveItems).sort(
        (a, b) => a.order - b.order,
      ) as LiveDataMap[K];
    }
    case "now": {
      const liveItems = parsePublishedList(live, (item) =>
        nowItemSchema.parse(item),
      );
      return mergeById(initialData as NowItem[], liveItems).sort(
        (a, b) => a.order - b.order,
      ) as LiveDataMap[K];
    }
    case "work": {
      const liveItems = parsePublishedList(live, (item) =>
        workItemSchema.parse(item),
      );
      return rewriteLinkedInInTree(
        mergePublishedWork(liveItems, initialData as WorkItem[]),
      ) as LiveDataMap[K];
    }
    case "writing": {
      const liveItems = parsePublishedList(live, (item) =>
        writingItemSchema.parse(item),
      );
      return rewriteLinkedInInTree(
        sortWritingItems(mergeById(initialData as WritingItem[], liveItems)),
      ) as LiveDataMap[K];
    }
    default: {
      return initialData;
    }
  }
}

async function fetchLivePublished(collection: LiveCollection): Promise<unknown> {
  const { fetchLivePublished: load } = await import("./livePublished");
  return load(collection);
}

function loadCached(collection: LiveCollection): Promise<unknown> {
  const existing = inflight.get(collection);
  if (existing) {
    return existing;
  }

  const promise = withTimeout(
    fetchLivePublished(collection),
    LIVE_CONTENT_TIMEOUT_MS,
  ).catch((error: unknown) => {
    inflight.delete(collection);
    throw error;
  });

  inflight.set(collection, promise);
  return promise;
}

export async function resolveLiveContent<K extends LiveCollection>(
  collection: K,
  initialData: LiveDataMap[K],
): Promise<LiveDataMap[K]> {
  try {
    const live = await loadCached(collection);
    return mergeLiveContent(collection, initialData, live);
  } catch {
    return initialData;
  }
}
