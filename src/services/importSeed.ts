import { isAdmin } from "@/lib/admin";
import { ADMIN_COLLECTION_NAMES } from "@/lib/admin/collections";
import { commitBatchSets } from "@/lib/firebase/batchWrite";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { ContentCollection } from "@/lib/firebase/constants";
import {
  buildSeedImportPayload,
  type SeedImportResult,
} from "@/lib/seed/importPayload";

export {
  buildSeedImportPayload,
  formatSeedImportSummary,
  type SeedImportPayload,
  type SeedImportResult,
} from "@/lib/seed/importPayload";

function writeErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown Firestore error";
}

export async function importSeedData(
  now: () => string = () => new Date().toISOString(),
): Promise<SeedImportResult> {
  const user = getFirebaseAuth()?.currentUser ?? null;
  if (!isAdmin(user)) {
    throw new Error("Only the admin can import seed data");
  }

  const payload = buildSeedImportPayload(now);

  for (const name of ADMIN_COLLECTION_NAMES) {
    const documents = payload.documents.filter(
      (document) => document.collection === name,
    );
    try {
      await commitBatchSets(
        documents.map((document) => ({
          collection: name as ContentCollection,
          id: document.id,
          data: document.data,
        })),
      );
    } catch (error: unknown) {
      throw new Error(
        `Failed to import ${name} (${documents.length} docs): ${writeErrorMessage(error)}`,
      );
    }
  }

  return {
    counts: payload.counts,
    total: payload.documents.length,
  };
}

