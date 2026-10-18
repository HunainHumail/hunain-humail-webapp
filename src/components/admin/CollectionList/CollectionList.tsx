"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { reorderCollectionIds } from "@/lib/admin/reorder";
import { cn } from "@/lib/utils/cn";

export interface CollectionListItem {
  id: string;
  title: string;
  status: "draft" | "published";
}

export interface CollectionListProps {
  items: CollectionListItem[];
  onReorder: (orderedIds: string[]) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSelect: (id: string) => void;
  selectedId?: string;
  addLabel?: string;
  className?: string;
}

export function applyCollectionReorder(
  items: readonly { id: string }[],
  activeId: string,
  overId: string | null,
): string[] | null {
  return reorderCollectionIds(
    items.map((item) => item.id),
    activeId,
    overId,
  );
}

export function CollectionList({
  items,
  onReorder,
  onDelete,
  onAdd,
  onSelect,
  selectedId,
  addLabel = "Add entry",
  className,
}: CollectionListProps) {
  const [pendingDelete, setPendingDelete] = useState<CollectionListItem | null>(
    null,
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(event: DragEndEvent) {
    const next = applyCollectionReorder(
      items,
      String(event.active.id),
      event.over ? String(event.over.id) : null,
    );
    if (next) {
      onReorder(next);
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div>
        <Button type="button" onClick={onAdd}>
          {addLabel}
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-muted">No entries yet.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <Table>
            <caption className="sr-only">Entries</caption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="sr-only">Reorder</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Delete</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <TableBody>
                {items.map((item) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    selected={item.id === selectedId}
                    onSelect={onSelect}
                    onDelete={() => setPendingDelete(item)}
                  />
                ))}
              </TableBody>
            </SortableContext>
          </Table>
        </DndContext>
      )}
      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {pendingDelete?.title ?? "this entry"}?
            </DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (!pendingDelete) {
                  return;
                }
                onDelete(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableRow({
  item,
  selected,
  onSelect,
  onDelete,
}: {
  item: CollectionListItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const published = item.status === "published";

  return (
    <TableRow ref={setNodeRef} style={style} data-selected={selected || undefined}>
      <TableCell>
        <button
          type="button"
          className="rounded-md p-1 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          aria-label={`Reorder ${item.title}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden="true" />
        </button>
      </TableCell>
      <TableCell>
        <button
          type="button"
          aria-current={selected ? "true" : undefined}
          className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          onClick={() => onSelect(item.id)}
        >
          {item.title}
        </button>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-wide",
            published ? "text-accent" : "text-muted",
          )}
        >
          {published ? "Published" : "Draft"}
        </span>
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant="outline"
          aria-label={`Delete ${item.title}`}
          onClick={onDelete}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
