import { addDoc, collection } from "firebase/firestore";
import { getFirebaseDb } from "../client";
import { COLLECTIONS } from "../constants";

export interface ContactMessageDoc {
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface MessagesRepository {
  create(doc: ContactMessageDoc): Promise<{ id: string }>;
}

export const messagesRepository: MessagesRepository = {
  async create(message: ContactMessageDoc): Promise<{ id: string }> {
    const firestore = getFirebaseDb();
    if (!firestore) {
      throw new Error("Firebase is not configured");
    }
    const created = await addDoc(
      collection(firestore, COLLECTIONS.messages),
      message,
    );
    return { id: created.id };
  },
};
