import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_EMAIL } from "@/lib/admin";

const getFirebaseAuth = vi.hoisted(() => vi.fn());
const createCliSession = vi.hoisted(() => vi.fn());

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseAuth: () => getFirebaseAuth(),
}));

vi.mock("@/lib/firebase/repositories/cliSessionsRepository", () => ({
  createCliSession: (...args: unknown[]) => createCliSession(...args),
}));

describe("submitCliSession", () => {
  beforeEach(() => {
    getFirebaseAuth.mockReset();
    createCliSession.mockReset();
    createCliSession.mockResolvedValue(undefined);
  });

  it("refuses to write when the signed-in user is not the admin", async () => {
    getFirebaseAuth.mockReturnValue({
      currentUser: { email: "other@example.com", emailVerified: true },
    });
    const { submitCliSession } = await import("./cliSessions");
    await expect(
      submitCliSession({ sessionId: "s1", code: "AB12CD" }),
    ).rejects.toThrow("Only the admin can authorize the CMS CLI");
    expect(createCliSession).not.toHaveBeenCalled();
  });

  it("writes the refresh token for the verified admin", async () => {
    getFirebaseAuth.mockReturnValue({
      currentUser: {
        email: ADMIN_EMAIL,
        emailVerified: true,
        refreshToken: "refresh-1",
      },
    });
    const { submitCliSession } = await import("./cliSessions");
    await submitCliSession({ sessionId: "s1", code: "AB12CD" });
    expect(createCliSession).toHaveBeenCalledWith({
      sessionId: "s1",
      code: "AB12CD",
      refreshToken: "refresh-1",
      email: ADMIN_EMAIL,
    });
  });
});
