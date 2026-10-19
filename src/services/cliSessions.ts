import { isAdmin } from "@/lib/admin";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { createCliSession } from "@/lib/firebase/repositories/cliSessionsRepository";

export async function submitCliSession(input: {
  sessionId: string;
  code: string;
}): Promise<void> {
  const user = getFirebaseAuth()?.currentUser ?? null;
  if (!isAdmin(user) || !user) {
    throw new Error("Only the admin can authorize the CMS CLI");
  }

  const refreshToken = user.refreshToken;
  const email = user.email;
  if (!refreshToken || !email) {
    throw new Error("Signed-in account is missing a refresh token");
  }

  await createCliSession({
    sessionId: input.sessionId,
    code: input.code,
    refreshToken,
    email,
  });
}
