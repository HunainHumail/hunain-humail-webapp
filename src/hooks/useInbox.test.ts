import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const inbox = vi.hoisted(() => ({
  listInbox: vi.fn(),
  subscribeInbox: vi.fn(),
  markInboxRead: vi.fn(),
}));

vi.mock("@/services/inbox", () => inbox);

const message = {
  id: "msg-1",
  name: "Ada Lovelace",
  email: "ada@example.com",
  topic: "Freelance",
  message: "I would like to build an agentic workflow.",
  createdAt: "2026-10-18T00:00:00.000Z",
  read: false,
};

describe("useInbox", () => {
  beforeEach(() => {
    inbox.listInbox.mockReset();
    inbox.subscribeInbox.mockReset();
    inbox.markInboxRead.mockReset();
    inbox.listInbox.mockResolvedValue([message]);
    inbox.subscribeInbox.mockImplementation(
      (onChange: (items: unknown[]) => void) => {
        onChange([message]);
        return () => undefined;
      },
    );
    inbox.markInboxRead.mockResolvedValue(undefined);
  });

  it("loads messages and marks one read", async () => {
    const { useInbox } = await import("./useInbox");
    const { result } = renderHook(() => useInbox());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toEqual([message]);

    await act(async () => {
      await result.current.markRead("msg-1");
    });
    expect(inbox.markInboxRead).toHaveBeenCalledWith("msg-1");
    expect(result.current.items[0]?.read).toBe(true);
  });
});
