import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { isFirebaseConfigured } from "@/lib/env";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { submitCliSession } from "@/services/cliSessions";

vi.mock("@/lib/env", () => ({
  isFirebaseConfigured: vi.fn(() => true),
}));

vi.mock("@/lib/firebase/auth", () => ({
  signInWithGoogle: vi.fn(),
}));

vi.mock("@/services/cliSessions", () => ({
  submitCliSession: vi.fn(),
}));

describe("useCliLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.mocked(signInWithGoogle).mockResolvedValue({
      email: "hunainhumail786@gmail.com",
    } as never);
    vi.mocked(submitCliSession).mockResolvedValue(undefined);
    window.history.replaceState(
      {},
      "",
      "/cli-login?session=session-1&code=AB12CD",
    );
  });

  it("reads the session from the URL and writes it after Google sign-in", async () => {
    const { useCliLogin } = await import("./useCliLogin");
    const { result } = renderHook(() => useCliLogin());

    expect(result.current.status).toBe("confirm");
    expect(result.current.code).toBe("AB12CD");
    expect(result.current.sessionId).toBe("session-1");

    await act(async () => {
      await result.current.confirmAndSignIn();
    });

    expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    expect(submitCliSession).toHaveBeenCalledWith({
      sessionId: "session-1",
      code: "AB12CD",
    });
    expect(result.current.status).toBe("done");
  });

  it("marks the request invalid when the URL is incomplete", async () => {
    window.history.replaceState({}, "", "/cli-login");
    const { useCliLogin } = await import("./useCliLogin");
    const { result } = renderHook(() => useCliLogin());

    expect(result.current.status).toBe("invalid");
    await act(async () => {
      await result.current.confirmAndSignIn();
    });
    expect(signInWithGoogle).not.toHaveBeenCalled();
  });
});
