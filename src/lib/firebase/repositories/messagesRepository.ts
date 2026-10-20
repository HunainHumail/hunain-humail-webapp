import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { inboxMessageSchema, type InboxMessage } from "@/lib/schemas/inboxMessage";
import { getFirebaseDb } from "../client";
import { COLLECTIONS } from "../constants";
import { normalizeDocument } from "../normalizeDocument";

export interface ContactMessageDoc {
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
  blueprintLeadId?: string;
}

export interface MessagesRepository {
  create(doc: ContactMessageDoc): Promise<{ id: string }>;
  list(): Promise<InboxMessage[]>;
  subscribe(
    onChange: (items: InboxMessage[]) => void,
    onError?: (error: Error) => void,
  ): () => void;
  markRead(id: string): Promise<void>;
}

function requireFirestore() {
  const firestore = getFirebaseDb();
  if (!firestore) {
    throw new Error("Firebase is not configured");
  }
  return firestore;
}

function toInboxMessage(id: string, data: unknown): InboxMessage | null {
  const parsed = inboxMessageSchema.safeParse(normalizeDocument(id, data));
  return parsed.success ? parsed.data : null;
}

function inboxQuery(firestore: ReturnType<typeof requireFirestore>) {
  return query(
    collection(firestore, COLLECTIONS.messages),
    orderBy("createdAt", "desc"),
  );
}

export const messagesRepository: MessagesRepository = {
  async create(message: ContactMessageDoc): Promise<{ id: string }> {
    const firestore = requireFirestore();
    const created = await addDoc(
      collection(firestore, COLLECTIONS.messages),
      message,
    );
    return { id: created.id };
  },

  async list(): Promise<InboxMessage[]> {
    const firestore = requireFirestore();
    const snapshot = await getDocs(inboxQuery(firestore));
    return snapshot.docs.flatMap((snapshotDoc) => {
      const message = toInboxMessage(snapshotDoc.id, snapshotDoc.data());
      return message ? [message] : [];
    });
  },

  subscribe(onChange, onError) {
    const firestore = getFirebaseDb();
    if (!firestore) {
      onError?.(new Error("Firebase is not configured"));
      return () => undefined;
    }
    return onSnapshot(
      inboxQuery(firestore),
      (snapshot) => {
        onChange(
          snapshot.docs.flatMap((snapshotDoc) => {
            const message = toInboxMessage(snapshotDoc.id, snapshotDoc.data());
            return message ? [message] : [];
          }),
        );
      },
      (error) => {
        onError?.(error);
      },
    );
  },

  async markRead(id: string): Promise<void> {
    const firestore = requireFirestore();
    await updateDoc(doc(firestore, COLLECTIONS.messages, id), { read: true });
  },
};
