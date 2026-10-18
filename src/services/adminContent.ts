import type { AdminCollectionName } from "@/lib/admin/collections";
import { isRecord } from "@/lib/admin/record";
import type { CollectionRepository } from "@/lib/firebase";
import {
  nowRepository,
  profileRepository,
  settingsRepository,
  storyRepository,
  workRepository,
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

function wrap<T>(repository: CollectionRepository<T>): AdminRepository {
  return {
    async list() {
      const items = await repository.list();
      return items.flatMap((item) => {
        const document = asAdminDocument(item);
        return document ? [document] : [];
      });
    },
    subscribe(onChange, onError) {
      return repository.subscribe((items) => {
        onChange(
          items.flatMap((item) => {
            const document = asAdminDocument(item);
            return document ? [document] : [];
          }),
        );
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
  profile: wrap(profileRepository),
  settings: wrap(settingsRepository),
  story: wrap(storyRepository),
  now: wrap(nowRepository),
  work: wrap(workRepository),
  writing: wrap(writingRepository),
};

export function getAdminRepository(name: AdminCollectionName): AdminRepository {
  return repositories[name];
}
