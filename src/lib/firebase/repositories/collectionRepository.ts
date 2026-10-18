import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getFirebaseDb } from "../client";
import type { ContentCollection } from "../constants";
import { normalizeDocument } from "../normalizeDocument";

export interface CollectionRepository<T> {
  listPublished(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  getBySlug(slug: string): Promise<T | null>;
  upsert(id: string, data: T): Promise<void>;
  delete(id: string): Promise<void>;
  reorder(orderedIds: string[]): Promise<void>;
}

function requireFirestore() {
  const firestore = getFirebaseDb();
  if (!firestore) {
    throw new Error("Firebase is not configured");
  }
  return firestore;
}

function asTypedDocument<T>(id: string, data: unknown): T {
  // Firestore is untyped storage; callers zod-parse before use.
  return normalizeDocument(id, data) as T;
}

export function createCollectionRepository<T>(
  collectionName: ContentCollection,
): CollectionRepository<T> {
  return {
    async listPublished(): Promise<T[]> {
      const firestore = requireFirestore();
      const published = query(
        collection(firestore, collectionName),
        where("status", "==", "published"),
        orderBy("order", "asc"),
      );
      const snapshot = await getDocs(published);
      return snapshot.docs.map((snapshotDoc) =>
        asTypedDocument<T>(snapshotDoc.id, snapshotDoc.data()),
      );
    },

    async getById(id: string): Promise<T | null> {
      const firestore = requireFirestore();
      const snapshot = await getDoc(doc(firestore, collectionName, id));
      if (!snapshot.exists()) {
        return null;
      }
      return asTypedDocument<T>(snapshot.id, snapshot.data());
    },

    async getBySlug(slug: string): Promise<T | null> {
      const firestore = requireFirestore();
      const bySlug = query(
        collection(firestore, collectionName),
        where("slug", "==", slug),
        where("status", "==", "published"),
        limit(1),
      );
      const snapshot = await getDocs(bySlug);
      const first = snapshot.docs[0];
      if (!first) {
        return null;
      }
      return asTypedDocument<T>(first.id, first.data());
    },

    async upsert(id: string, data: T): Promise<void> {
      const firestore = requireFirestore();
      await setDoc(
        doc(firestore, collectionName, id),
        { ...(data as Record<string, unknown>) },
        { merge: true },
      );
    },

    async delete(id: string): Promise<void> {
      const firestore = requireFirestore();
      await deleteDoc(doc(firestore, collectionName, id));
    },

    async reorder(orderedIds: string[]): Promise<void> {
      const firestore = requireFirestore();
      const batch = writeBatch(firestore);
      orderedIds.forEach((id, index) => {
        batch.update(doc(firestore, collectionName, id), { order: index });
      });
      await batch.commit();
    },
  };
}
