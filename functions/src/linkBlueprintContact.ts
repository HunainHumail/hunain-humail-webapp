import type { Firestore } from "firebase-admin/firestore";
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { COLLECTIONS } from "@/lib/firebase/constants";

export function createLinkHandler(db: Firestore) {
  return async (
    event: FirestoreEvent<QueryDocumentSnapshot | undefined, { messageId: string }>,
  ) => {
    const messageId = event.params.messageId;
    const snapshot = event.data;
    const data = snapshot?.data();
    if (!data || typeof data.blueprintLeadId !== "string") {
      return;
    }
    const leadId = data.blueprintLeadId;
    const leadRef = db.collection(COLLECTIONS.blueprintLeads).doc(leadId);

    await db.runTransaction(async (tx) => {
      const leadSnap = await tx.get(leadRef);
      if (!leadSnap.exists) {
        return;
      }
      const lead = leadSnap.data();
      if (lead?.contactMessageId) {
        return;
      }
      tx.update(leadRef, { contactMessageId: messageId });
    });
  };
}
