import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  blueprintLeadSchema,
  blueprintLeadStatusSchema,
  type BlueprintLead,
  type BlueprintLeadStatus,
} from "@/lib/schemas/blueprint";
import { getFirebaseDb } from "../client";
import { COLLECTIONS } from "../constants";
import { normalizeDocument } from "../normalizeDocument";

export interface BlueprintLeadsRepository {
  list(): Promise<BlueprintLead[]>;
  subscribe(
    onChange: (items: BlueprintLead[]) => void,
    onError?: (error: Error) => void,
  ): () => void;
  updateStatus(id: string, status: BlueprintLeadStatus): Promise<void>;
}

function requireFirestore() {
  const firestore = getFirebaseDb();
  if (!firestore) {
    throw new Error("Firebase is not configured");
  }
  return firestore;
}

function toLead(id: string, data: unknown): BlueprintLead | null {
  const parsed = blueprintLeadSchema.safeParse(normalizeDocument(id, data));
  return parsed.success ? parsed.data : null;
}

function leadsQuery(firestore: ReturnType<typeof requireFirestore>) {
  return query(
    collection(firestore, COLLECTIONS.blueprintLeads),
    orderBy("createdAt", "desc"),
  );
}

export const blueprintLeadsRepository: BlueprintLeadsRepository = {
  async list() {
    const firestore = requireFirestore();
    const snapshot = await getDocs(leadsQuery(firestore));
    return snapshot.docs.flatMap((snapshotDoc) => {
      const lead = toLead(snapshotDoc.id, snapshotDoc.data());
      return lead ? [lead] : [];
    });
  },

  subscribe(onChange, onError) {
    const firestore = getFirebaseDb();
    if (!firestore) {
      onError?.(new Error("Firebase is not configured"));
      return () => undefined;
    }
    return onSnapshot(
      leadsQuery(firestore),
      (snapshot) => {
        onChange(
          snapshot.docs.flatMap((snapshotDoc) => {
            const lead = toLead(snapshotDoc.id, snapshotDoc.data());
            return lead ? [lead] : [];
          }),
        );
      },
      (error) => {
        onError?.(error);
      },
    );
  },

  async updateStatus(id, status) {
    const parsedStatus = blueprintLeadStatusSchema.parse(status);
    const firestore = requireFirestore();
    await updateDoc(doc(firestore, COLLECTIONS.blueprintLeads, id), {
      status: parsedStatus,
    });
  },
};
