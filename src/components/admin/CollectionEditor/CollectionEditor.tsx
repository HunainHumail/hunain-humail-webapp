"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createDocumentId,
  getCollectionConfig,
  type AdminCollectionName,
} from "@/lib/admin/collections";
import { getPath, readString } from "@/lib/admin/record";
import type { AdminDocument } from "@/services/adminContent";
import { useCollection } from "@/hooks/useCollection";
import { cn } from "@/lib/utils/cn";
import { CollectionList, type CollectionListItem } from "../CollectionList";
import { EditorForm } from "../EditorForm";

export interface CollectionEditorProps {
  collection: AdminCollectionName;
  className?: string;
}

function listTitle(item: AdminDocument, titleField: string): string {
  const value = titleField.includes(".")
    ? getPath(item, titleField)
    : item[titleField];
  const title = readString(value).trim();
  return title.length > 0 ? title : "Untitled";
}

function listStatus(item: AdminDocument): CollectionListItem["status"] {
  return item.status === "published" ? "published" : "draft";
}

export function CollectionEditor({
  collection,
  className,
}: CollectionEditorProps) {
  const config = getCollectionConfig(collection);
  const { items, loading, error, save, remove, reorder } = useCollection(collection);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdminDocument | null>(null);
  const blank = useMemo(() => config.createBlank(), [config]);

  const visible = useMemo(() => {
    if (!draft || items.some((item) => item.id === draft.id)) {
      return items;
    }
    return [...items, draft];
  }, [draft, items]);

  const selected =
    (draft && draft.id === selectedId ? draft : null) ??
    visible.find((item) => item.id === selectedId) ??
    null;

  const singleton = visible.find((item) => item.id === config.singletonId) ?? null;
  const singletonInitial = singleton ?? blank;

  const persist = useCallback(
    async (data: Record<string, unknown>) => {
      const id =
        config.singletonId ??
        (typeof data.id === "string" && data.id.length > 0 ? data.id : selectedId);
      if (!id) {
        throw new Error("Missing document id");
      }
      await save(id, data);
      setDraft(null);
    },
    [config.singletonId, save, selectedId],
  );

  function addItem() {
    const id = createDocumentId(collection);
    const next: AdminDocument = {
      ...config.createBlank(),
      id,
      order: items.length,
      status: "draft",
    };
    setDraft(next);
    setSelectedId(id);
  }

  async function deleteItem(id: string) {
    if (draft?.id === id) {
      setDraft(null);
      setSelectedId(null);
      return;
    }
    await remove(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-muted">
          Admin
        </p>
        <h1 className="font-display text-4xl tracking-tight">{config.label}</h1>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      {loading && visible.length === 0 ? <p role="status">Loading</p> : null}
      {config.singletonId ? (
        loading && !singleton ? null : (
          <EditorForm
            key={config.singletonId}
            collection={collection}
            initial={singletonInitial}
            onSave={persist}
          />
        )
      ) : (
        <>
          <CollectionList
            items={visible.map((item) => ({
              id: item.id,
              title: listTitle(item, config.titleField),
              status: listStatus(item),
            }))}
            addLabel={config.addLabel}
            selectedId={selectedId ?? undefined}
            onAdd={addItem}
            onSelect={(id) => {
              if (draft && draft.id !== id) {
                setDraft(null);
              }
              setSelectedId(id);
            }}
            onDelete={(id) => {
              void deleteItem(id);
            }}
            onReorder={(orderedIds) => {
              void reorder(orderedIds);
            }}
          />
          {selected ? (
            <EditorForm
              key={selected.id}
              collection={collection}
              initial={selected}
              onSave={persist}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
