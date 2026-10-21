import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { HEALTH_LOOKBACK_MS, HEALTH_QUERY_LIMIT } from "@/lib/health/limits";
import { healthEventSchema, type HealthEvent } from "@/lib/schemas/healthEvent";
import { getFirebaseDb } from "../client";
import { COLLECTIONS } from "../constants";
import { normalizeDocument } from "../normalizeDocument";

export interface HealthEventsRepository {
  listRecent(now?: number): Promise<HealthEvent[]>;
  countSince(sinceMs: number): Promise<number>;
}

function toEvent(id: string, data: unknown): HealthEvent | null {
  const parsed = healthEventSchema.safeParse(normalizeDocument(id, data));
  return parsed.success ? parsed.data : null;
}

export const healthEventsRepository: HealthEventsRepository = {
  async listRecent(now = Date.now()) {
    const firestore = getFirebaseDb();
    if (!firestore) {
      return [];
    }
    const snapshot = await getDocs(
      query(
        collection(firestore, COLLECTIONS.healthEvents),
        where("createdAt", ">=", Timestamp.fromMillis(now - HEALTH_LOOKBACK_MS)),
        orderBy("createdAt", "desc"),
        limit(HEALTH_QUERY_LIMIT),
      ),
    );
    return snapshot.docs.flatMap((snapshotDoc) => {
      const event = toEvent(snapshotDoc.id, snapshotDoc.data());
      return event ? [event] : [];
    });
  },

  async countSince(sinceMs: number) {
    const firestore = getFirebaseDb();
    if (!firestore) {
      return 0;
    }
    const snapshot = await getCountFromServer(
      query(
        collection(firestore, COLLECTIONS.healthEvents),
        where("createdAt", ">=", Timestamp.fromMillis(sinceMs)),
      ),
    );
    return snapshot.data().count;
  },
};
