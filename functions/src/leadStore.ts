import {
  FieldValue,
  type Firestore,
  type Transaction,
} from "firebase-admin/firestore";
import { COLLECTIONS } from "@/lib/firebase/constants";
import {
  evaluateLimits,
  expiresAt,
  type RateLimitConfig,
  type RateLimitKeys,
} from "@/lib/blueprint/rateLimit";
import type { z } from "zod";
import type { blueprintLeadWriteSchema } from "@/lib/schemas/blueprint";

type LeadWrite = z.infer<typeof blueprintLeadWriteSchema>;

export interface LeadStore {
  reserve(
    keys: RateLimitKeys,
    limits: RateLimitConfig,
    now: Date,
  ): Promise<{ ok: true } | { ok: false; reason: "rate-limit" | "daily-budget" }>;
  writeLead(data: LeadWrite): Promise<{ id: string }>;
}

function readCountFromSnap(
  data: Record<string, unknown> | undefined,
): number {
  return typeof data?.count === "number" ? data.count : 0;
}

/** Firestore rejects explicit `undefined`. Optional fields must be omitted. */
export function omitUndefined(
  data: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
}

export function createLeadStore(db: Firestore): LeadStore {
  return {
    async reserve(keys, limits, now) {
      return db.runTransaction(async (tx: Transaction) => {
        const ipRef = db.collection(COLLECTIONS.blueprintRateLimits).doc(keys.ip);
        const emailRef = db
          .collection(COLLECTIONS.blueprintRateLimits)
          .doc(keys.email);
        const globalRef = db
          .collection(COLLECTIONS.blueprintRateLimits)
          .doc(keys.global);

        const [ipSnap, emailSnap, globalSnap] = await Promise.all([
          tx.get(ipRef),
          tx.get(emailRef),
          tx.get(globalRef),
        ]);

        const ip = readCountFromSnap(ipSnap.data());
        const email = readCountFromSnap(emailSnap.data());
        const global = readCountFromSnap(globalSnap.data());

        const verdict = evaluateLimits({ ip, email, global }, limits);
        if (!verdict.ok) {
          return verdict;
        }

        const exp = expiresAt(now);
        tx.set(ipRef, { count: ip + 1, expiresAt: exp }, { merge: true });
        tx.set(emailRef, { count: email + 1, expiresAt: exp }, { merge: true });
        tx.set(globalRef, { count: global + 1, expiresAt: exp }, { merge: true });
        return { ok: true as const };
      });
    },

    async writeLead(data) {
      const ref = await db.collection(COLLECTIONS.blueprintLeads).add({
        ...omitUndefined(data),
        createdAt: FieldValue.serverTimestamp(),
      });
      return { id: ref.id };
    },
  };
}
