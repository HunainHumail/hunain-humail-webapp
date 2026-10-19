import {
  getCollectionConfig,
  type AdminCollectionName,
} from "@/lib/admin/collections";
import { hydrateDocument } from "@/lib/admin/documentForm";
import { isRecord } from "@/lib/admin/record";
import type { CollectionRepository } from "@/lib/firebase";
import {
  nowRepository,
  profileRepository,
  settingsRepository,
  storyRepository,
  workRepository,
  testimonialsRepository,
  writingRepository,
} from "@/lib/firebase/repositories";

export interface AdminDocument extends Record<string, unknown> {
  id: string;
}

export interface AdminRepository {
  list(): Promise<AdminDocument[]>;
  subscribe(
    onChange: (items: AdminDocument[]) => void,
    onError?: (error: Error) => void,
  ): () => void;
  upsert(id: string, data: AdminDocument): Promise<void>;
  delete(id: string): Promise<void>;
  reorder(orderedIds: string[]): Promise<void>;
}

function asAdminDocument(value: unknown): AdminDocument | null {
  if (!isRecord(value) || typeof value.id !== "string" || value.id.length === 0) {
    return null;
  }
  return value as AdminDocument;
}

function wrap<T>(
  name: AdminCollectionName,
  repository: CollectionRepository<T>,
): AdminRepository {
  const schema = getCollectionConfig(name).schema;

  function toDocuments(items: T[]): AdminDocument[] {
    return items.flatMap((item) => {
      const document = asAdminDocument(item);
      if (!document) {
        return [];
      }
      const hydrated = asAdminDocument(hydrateDocument(schema, document));
      return hydrated ? [hydrated] : [];
    });
  }

  return {
    async list() {
      return toDocuments(await repository.list());
    },
    subscribe(onChange, onError) {
      return repository.subscribe((items) => {
        onChange(toDocuments(items));
      }, onError);
    },
    async upsert(id, data) {
      await repository.upsert(id, data as T);
    },
    delete(id) {
      return repository.delete(id);
    },
    reorder(orderedIds) {
      return repository.reorder(orderedIds);
    },
  };
}

const repositories: Record<AdminCollectionName, AdminRepository> = {
  profile: wrap("profile", profileRepository),
  settings: wrap("settings", settingsRepository),
  story: wrap("story", storyRepository),
  now: wrap("now", nowRepository),
  work: wrap("work", workRepository),
  writing: wrap("writing", writingRepository),
  testimonials: wrap("testimonials", testimonialsRepository),
};

export function getAdminRepository(name: AdminCollectionName): AdminRepository {
  return repositories[name];
}
