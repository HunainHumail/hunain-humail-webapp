import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { cliSessionWriteSchema } from "@/lib/schemas/cliSession";
import { getFirebaseDb } from "../client";
import { COLLECTIONS } from "../constants";

export interface CliSessionCreateInput {
  sessionId: string;
  refreshToken: string;
  email: string;
  code: string;
}

function requireFirestore() {
  const firestore = getFirebaseDb();
  if (!firestore) {
    throw new Error("Firebase is not configured");
  }
  return firestore;
}

export async function createCliSession(
  input: CliSessionCreateInput,
): Promise<void> {
  const parsed = cliSessionWriteSchema.safeParse({
    refreshToken: input.refreshToken,
    email: input.email,
    code: input.code,
  });
  if (!parsed.success) {
    throw new Error("CLI session payload is invalid");
  }

  const firestore = requireFirestore();
  await setDoc(doc(firestore, COLLECTIONS.cliSessions, input.sessionId), {
    refreshToken: parsed.data.refreshToken,
    email: parsed.data.email,
    code: parsed.data.code,
    createdAt: serverTimestamp(),
  });
}
