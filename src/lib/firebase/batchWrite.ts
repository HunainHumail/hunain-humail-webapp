import { doc, writeBatch } from "firebase/firestore";
import { chunkItems } from "@/lib/utils/chunkItems";
import { stripUndefined } from "@/lib/utils/stripUndefined";
import { getFirebaseDb } from "./client";
import type { ContentCollection } from "./constants";

export interface BatchSetOp {
  collection: ContentCollection;
  id: string;
  data: Record<string, unknown>;
}

function requireFirestore() {
  const firestore = getFirebaseDb();
  if (!firestore) {
    throw new Error("Firebase is not configured");
  }
  return firestore;
}

function sanitizeWriteData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const stripped = stripUndefined(data);
  if (typeof stripped !== "object" || stripped === null || Array.isArray(stripped)) {
    throw new Error("Document is invalid");
  }
  return stripped as Record<string, unknown>;
}

function writeErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown Firestore error";
}

export async function commitBatchSets(
  operations: readonly BatchSetOp[],
): Promise<void> {
  if (operations.length === 0) {
    return;
  }

  const firestore = requireFirestore();

  for (const chunk of chunkItems([...operations])) {
    const batch = writeBatch(firestore);
    for (const operation of chunk) {
      batch.set(
        doc(firestore, operation.collection, operation.id),
        sanitizeWriteData(operation.data),
        { merge: true },
      );
    }
    try {
      await batch.commit();
    } catch (error: unknown) {
      const sample = chunk[0];
      const hint = sample
        ? `${sample.collection}/${sample.id}`
        : "unknown document";
      throw new Error(
        `Firestore write failed (${chunk.length} docs, ${hint}): ${writeErrorMessage(error)}`,
      );
    }
  }
}
