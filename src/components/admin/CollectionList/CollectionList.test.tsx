import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CollectionList, applyCollectionReorder } from "./CollectionList";

const items = [
  { id: "a", title: "Alpha", status: "draft" as const },
  { id: "b", title: "Beta", status: "published" as const },
];

describe("CollectionList", () => {
  it("reorders ids when the dragged item changes place", () => {
    expect(applyCollectionReorder(items, "a", "b")).toEqual(["b", "a"]);
    expect(applyCollectionReorder(items, "a", "a")).toBeNull();
  });

  it("asks for a new entry and selects one", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onSelect = vi.fn();
    render(
      <CollectionList
        items={items}
        onReorder={vi.fn()}
        onDelete={vi.fn()}
        onAdd={onAdd}
        onSelect={onSelect}
        addLabel="Add story entry"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add story entry" }));
    expect(onAdd).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Alpha" }));
    expect(onSelect).toHaveBeenCalledWith("a");
  });

  it("confirms before deleting an entry", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <CollectionList
        items={items}
        onReorder={vi.fn()}
        onDelete={onDelete}
        onAdd={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete Alpha" }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Delete Alpha?" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith("a");
  });
});
