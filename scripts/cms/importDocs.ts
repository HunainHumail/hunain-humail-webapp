import {
  getCollectionConfig,
  type AdminCollectionName,
} from "@/lib/admin/collections";
import { formatSchemaIssues } from "@/lib/admin/documentForm";
import { isRecord } from "@/lib/admin/record";
import {
  PROFILE_DOC_ID,
  SETTINGS_DOC_ID,
} from "@/lib/firebase/constants";
import { chunkItems } from "@/lib/utils/chunkItems";
import { stripUndefined } from "@/lib/utils/stripUndefined";
import { FIRESTORE_COMMIT_LIMIT, type CommitWrite } from "./firestoreRest";

export interface PreparedImportDoc {
  id: string;
  data: Record<string, unknown>;
}

export interface ImportPlan {
  writes: CommitWrite[];
  created: number;
  updated: number;
}

export function applyPublishedMapping(
  source: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...source };
  if (next.published === true) {
    next.status = "published";
  } else if (next.published === false && next.status === undefined) {
    next.status = "draft";
  }
  delete next.published;
  return next;
}

export function resolveDocumentId(
  collection: AdminCollectionName,
  source: Record<string, unknown>,
): string {
  if (collection === "profile") {
    return PROFILE_DOC_ID;
  }
  if (collection === "settings") {
    return SETTINGS_DOC_ID;
  }
  if (typeof source.id === "string" && source.id.length > 0) {
    return source.id;
  }
  if (typeof source.slug === "string" && source.slug.length > 0) {
    return source.slug;
  }
  throw new Error(`${collection} document needs an id or slug`);
}

export function prepareCmsDocument(
  collection: AdminCollectionName,
  source: unknown,
  updatedAt: string,
  existing?: Record<string, unknown>,
): PreparedImportDoc {
  if (!isRecord(source)) {
    throw new Error(`${collection} document is not an object`);
  }

  const mapped = applyPublishedMapping({ ...existing, ...source });
  const id = resolveDocumentId(collection, { ...existing, ...mapped });
  const withMeta: Record<string, unknown> = {
    ...mapped,
    updatedAt,
  };
  if (collection !== "profile" && collection !== "settings") {
    withMeta.id = id;
  }

  const parsed = getCollectionConfig(collection).schema.safeParse(withMeta);
  if (!parsed.success) {
    throw new Error(
      `${collection}/${id} is invalid: ${formatSchemaIssues(parsed.error)}`,
    );
  }
  if (!isRecord(parsed.data)) {
    throw new Error(`${collection}/${id} is invalid`);
  }
  const stripped = stripUndefined(parsed.data);
  if (!isRecord(stripped)) {
    throw new Error(`${collection}/${id} is invalid`);
  }
  return { id, data: stripped };
}

export function planImport(options: {
  collection: AdminCollectionName;
  documents: unknown[];
  existingIds: ReadonlySet<string>;
  updatedAt: string;
}): ImportPlan {
  const writes: CommitWrite[] = [];
  let created = 0;
  let updated = 0;

  for (const document of options.documents) {
    const prepared = prepareCmsDocument(
      options.collection,
      document,
      options.updatedAt,
    );
    writes.push({
      collection: options.collection,
      id: prepared.id,
      data: prepared.data,
    });
    if (options.existingIds.has(prepared.id)) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  return { writes, created, updated };
}

export function chunkImportWrites(
  writes: readonly CommitWrite[],
): CommitWrite[][] {
  return chunkItems(writes, FIRESTORE_COMMIT_LIMIT);
}
