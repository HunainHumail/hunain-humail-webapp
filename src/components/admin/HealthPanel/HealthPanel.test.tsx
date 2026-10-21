import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { formatHealthTime } from "@/lib/health/formatHealthTime";
import type { HealthEvent } from "@/lib/schemas/healthEvent";
import { HealthPanel } from "./HealthPanel";

const now = Date.now();
const recent = new Date(now - 60 * 60 * 1000).toISOString();
const older = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();

const items: HealthEvent[] = [
  {
    id: "recent",
    source: "client",
    type: "timeout",
    code: "functions/deadline-exceeded",
    message: "Live content timed out",
    page: "/",
    sessionId: "sess",
    ua: "TestAgent",
    createdAt: recent,
  },
  {
    id: "older",
    source: "server",
    type: "provider-error",
    code: "internal",
    message: "Provider error",
    leadId: "lead-9",
    createdAt: older,
  },
];

const state = vi.hoisted(() => ({
  items: [] as HealthEvent[],
  loading: false,
  error: null as string | null,
}));

vi.mock("@/hooks/useHealthEvents", () => ({
  useHealthEvents: () => state,
}));

describe("HealthPanel", () => {
  it("lists 7 days, counts type and source, and filters to 24h", async () => {
    state.items = items;
    state.loading = false;
    state.error = null;
    const user = userEvent.setup();
    render(<HealthPanel />);

    expect(screen.getByRole("heading", { level: 1, name: "Health" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Dubai" })).toBeInTheDocument();
    expect(screen.getByText(formatHealthTime(recent))).toBeInTheDocument();
    expect(screen.getByText("timeout 1")).toBeInTheDocument();
    expect(screen.getByText("provider-error 1")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Counts by source" })).toHaveTextContent(
      "Client 1",
    );
    expect(screen.getByRole("region", { name: "Counts by source" })).toHaveTextContent(
      "Server 1",
    );
    expect(screen.getByRole("link", { name: "lead-9" })).toHaveAttribute(
      "href",
      "/admin/blueprints?id=lead-9",
    );

    await user.click(screen.getByRole("button", { name: "24h" }));
    expect(screen.getByRole("button", { name: "24h" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("provider-error 1")).not.toBeInTheDocument();
    expect(screen.getByText("timeout 1")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Counts by source" })).toHaveTextContent(
      "Server 0",
    );
    expect(screen.queryByText("Provider error")).not.toBeInTheDocument();
  });

  it("shows an empty window", () => {
    state.items = [];
    state.loading = false;
    state.error = null;
    render(<HealthPanel />);
    expect(screen.getByText("No failures in this window.")).toBeInTheDocument();
  });
});
