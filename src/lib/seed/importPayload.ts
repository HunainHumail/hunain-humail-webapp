import {
  ADMIN_COLLECTION_NAMES,
  getCollectionConfig,
  type AdminCollectionName,
} from "@/lib/admin/collections";
import { formatSchemaIssues } from "@/lib/admin/documentForm";
import { isRecord } from "@/lib/admin/record";
import {
  PROFILE_DOC_ID,
  SETTINGS_DOC_ID,
} from "@/lib/firebase/constants";
import { FIRESTORE_WRITE_CHUNK_SIZE } from "@/lib/utils/chunkItems";
import { stripUndefined } from "@/lib/utils/stripUndefined";
import { nowSeed } from "./now";
import { profileSeed } from "./profile";
import { siteSettingsSeed } from "./settings";
import { storySeed } from "./story";
import { workSeed } from "./work";
import { writingImportItems } from "./writing";

export { FIRESTORE_WRITE_CHUNK_SIZE };

export interface SeedImportDocument {
  collection: AdminCollectionName;
  id: string;
  data: Record<string, unknown>;
}

export type SeedImportCounts = Record<AdminCollectionName, number>;

export interface SeedImportPayload {
  documents: SeedImportDocument[];
  counts: SeedImportCounts;
}

export interface SeedImportResult {
  counts: SeedImportCounts;
  total: number;
}

function prepareSeedDocument(
  collection: AdminCollectionName,
  id: string,
  source: unknown,
  updatedAt: string,
): Record<string, unknown> {
  if (!isRecord(source)) {
    throw new Error(`Seed document ${collection}/${id} is not an object`);
  }

  const withMeta: Record<string, unknown> = { ...source, updatedAt };
  if (collection !== "profile" && collection !== "settings") {
    withMeta.id = id;
  }

  const parsed = getCollectionConfig(collection).schema.safeParse(withMeta);
  if (!parsed.success) {
    throw new Error(
      `Seed document ${collection}/${id} is invalid: ${formatSchemaIssues(parsed.error)}`,
    );
  }
  if (!isRecord(parsed.data)) {
    throw new Error(`Seed document ${collection}/${id} is invalid`);
  }

  const stripped = stripUndefined(parsed.data);
  if (!isRecord(stripped)) {
    throw new Error(`Seed document ${collection}/${id} is invalid`);
  }
  return stripped;
}

function singleton(
  collection: "profile" | "settings",
  id: string,
  source: unknown,
  updatedAt: string,
): SeedImportDocument {
  return {
    collection,
    id,
    data: prepareSeedDocument(collection, id, source, updatedAt),
  };
}

function listDocuments(
  collection: Exclude<AdminCollectionName, "profile" | "settings">,
  items: readonly { id: string }[],
  updatedAt: string,
): SeedImportDocument[] {
  return items.map((item) => ({
    collection,
    id: item.id,
    data: prepareSeedDocument(collection, item.id, item, updatedAt),
  }));
}

function emptyCounts(): SeedImportCounts {
  return {
    profile: 0,
    story: 0,
    now: 0,
    work: 0,
    writing: 0,
    settings: 0,
  };
}

export function buildSeedImportPayload(
  now: () => string = () => new Date().toISOString(),
): SeedImportPayload {
  const updatedAt = now();
  const documents: SeedImportDocument[] = [
    singleton("profile", PROFILE_DOC_ID, profileSeed, updatedAt),
    singleton("settings", SETTINGS_DOC_ID, siteSettingsSeed, updatedAt),
    ...listDocuments("story", storySeed, updatedAt),
    ...listDocuments("now", nowSeed, updatedAt),
    ...listDocuments("work", workSeed, updatedAt),
    ...listDocuments("writing", writingImportItems(), updatedAt),
  ];

  const counts = emptyCounts();
  for (const document of documents) {
    counts[document.collection] += 1;
  }

  return { documents, counts };
}

export function formatSeedImportSummary(counts: SeedImportCounts): string {
  const parts = ADMIN_COLLECTION_NAMES.map(
    (name) => `${name} ${counts[name]}`,
  );
  return `Imported ${parts.join(", ")}.`;
}
