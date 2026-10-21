import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/lib/firebase/constants";
import { HEALTH_FIELD_LIMITS } from "@/lib/health/limits";
import { sanitizeHealthText } from "@/lib/health/sanitizeHealthText";

export interface ServerHealthEvent {
  type: string;
  code: string;
  message: string;
  leadId?: string;
}

export interface HealthEventWriter {
  write(event: ServerHealthEvent): Promise<void>;
}

export function createHealthEventWriter(db: Firestore): HealthEventWriter {
  return {
    async write(event) {
      const type = sanitizeHealthText(event.type, HEALTH_FIELD_LIMITS.type);
      if (!type) {
        return;
      }
      const message =
        sanitizeHealthText(event.message, HEALTH_FIELD_LIMITS.message) || type;
      const data: Record<string, unknown> = {
        source: "server",
        type,
        code: sanitizeHealthText(event.code, HEALTH_FIELD_LIMITS.code),
        message,
        createdAt: FieldValue.serverTimestamp(),
      };
      if (event.leadId) {
        const leadId = sanitizeHealthText(event.leadId, HEALTH_FIELD_LIMITS.leadId);
        if (leadId) {
          data.leadId = leadId;
        }
      }
      await db.collection(COLLECTIONS.healthEvents).add(data);
    },
  };
}
