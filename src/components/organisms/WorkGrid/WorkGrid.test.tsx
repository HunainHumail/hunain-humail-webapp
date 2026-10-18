import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { workSeed } from "@/lib/seed/work";
import { workFilterTabs } from "@/lib/utils/filterWorkByCategory";
import { WorkGrid } from "./WorkGrid";

function tabLabel(value: string): string {
  const label = workFilterTabs(workSeed).find((tab) => tab.value === value)?.label;
  if (!label) {
    throw new Error(`Missing filter tab: ${value}`);
  }
  return label;
}

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

describe("WorkGrid", () => {
  it("renders the work section and case studies", () => {
    render(<WorkGrid items={workSeed} />);

    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Things I've built." }),
    ).toBeInTheDocument();
    expect(document.getElementById("work")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Trinnect" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Case studies" })).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Filter work by category" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Trinnect cover" })).toHaveAttribute(
      "src",
      "/projects/trinnect/cover.webp",
    );
    expect(screen.getByRole("button", { name: tabLabel("all") })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows every project under the default All filter", () => {
    render(<WorkGrid items={workSeed} />);
    const list = screen.getByRole("list", { name: "Case studies" });
    expect(within(list).getAllByRole("heading", { level: 3 })).toHaveLength(
      workSeed.length,
    );
    for (const item of workSeed) {
      expect(
        within(list).getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
    }
  });

  it("links to the full project index", () => {
    render(<WorkGrid items={workSeed} viewAllHref="/work" />);
    expect(
      screen.getByRole("link", {
        name: `View all projects (${workSeed.length})`,
      }),
    ).toHaveAttribute("href", "/work");
  });

  it("filters cards by category", async () => {
    const user = userEvent.setup();
    render(<WorkGrid items={workSeed} />);

    const filters = screen.getByRole("group", { name: "Filter work by category" });
    await user.click(
      within(filters).getByRole("button", { name: tabLabel("ai-systems") }),
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Trinnect" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Banoon" }),
    ).not.toBeInTheDocument();

    await user.click(
      within(filters).getByRole("button", { name: tabLabel("client-apps") }),
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Al Rayyan TV" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Trinnect" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: tabLabel("all") }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Trinnect" }),
    ).toBeInTheDocument();
  });

  it("makes featured cards span two columns", () => {
    render(<WorkGrid items={workSeed} />);
    const list = screen.getByRole("list", { name: "Case studies" });
    const featuredItem = within(list)
      .getByRole("heading", { level: 3, name: "Trinnect" })
      .closest("li");
    expect(featuredItem).toHaveClass("sm:col-span-2");
  });
});
