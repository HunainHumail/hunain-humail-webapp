import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MessagesPanel } from "./MessagesPanel";

const markRead = vi.fn();

vi.mock("@/hooks/useInbox", () => ({
  useInbox: () => ({
    items: [
      {
        id: "msg-1",
        name: "Ada Lovelace",
        email: "ada@example.com",
        topic: "Freelance",
        message: "I would like to build an agentic workflow.",
        createdAt: "2026-10-18T00:00:00.000Z",
        read: false,
      },
    ],
    loading: false,
    error: null,
    markRead,
  }),
}));

describe("MessagesPanel", () => {
  it("lists a message and marks it read", async () => {
    const user = userEvent.setup();
    render(<MessagesPanel />);

    expect(screen.getByRole("heading", { name: "Messages" })).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(
      screen.getByText("I would like to build an agentic workflow."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mark read" }));
    expect(markRead).toHaveBeenCalledWith("msg-1");
  });
});
