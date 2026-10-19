import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CollectionEditor } from "./CollectionEditor";

vi.mock("@/hooks/useCollection", () => ({
  useCollection: () => ({
    items: [],
    loading: false,
    error: null,
    save: vi.fn(),
    remove: vi.fn(),
    reorder: vi.fn(),
  }),
}));

describe("CollectionEditor", () => {
  it("opens a blank story form from the add action", async () => {
    const user = userEvent.setup();
    render(<CollectionEditor collection="story" />);

    expect(screen.getByRole("heading", { name: "Story" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add story entry" }));
    expect(screen.getByRole("textbox", { name: "Title" })).toBeInTheDocument();
  });

  it("includes a markdown body and cover image for work", async () => {
    const user = userEvent.setup();
    render(<CollectionEditor collection="work" />);

    await user.click(screen.getByRole("button", { name: "Add work item" }));

    expect(screen.getByRole("tab", { name: "Write" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Image URL" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Upload image")).not.toBeInTheDocument();
  });

  it("opens testimonials fields for source, rating, and avatar", async () => {
    const user = userEvent.setup();
    render(<CollectionEditor collection="testimonials" />);

    await user.click(screen.getByRole("button", { name: "Add testimonial" }));

    expect(screen.getByLabelText("Source")).toBeInTheDocument();
    expect(screen.getByLabelText("Rating")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Image URL" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Quote" })).toBeInTheDocument();
  });

  it("shows the profile form without a collection list", () => {
    render(<CollectionEditor collection="profile" />);

    expect(screen.getByRole("heading", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add profile" })).not.toBeInTheDocument();
  });
});
