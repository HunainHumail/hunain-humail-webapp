"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCollectionConfig,
  type AdminCollectionName,
} from "@/lib/admin/collections";
import { isRecord } from "@/lib/admin/record";
import {
  getAdminRepository,
  type AdminDocument,
} from "@/services/adminContent";

export interface UseCollectionResult {
  items: AdminDocument[];
  loading: boolean;
  error: string | null;
  save: (id: string, data: Record<string, unknown>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reorder: (orderedIds: string[]) => Promise<void>;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useCollection(name: AdminCollectionName): UseCollectionResult {
  const repository = useMemo(() => getAdminRepository(name), [name]);
  const [items, setItems] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;

    repository
      .list()
      .then((next) => {
        if (!active) {
          return;
        }
        setItems(next);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) {
          return;
        }
        setError(errorMessage(caught, "Could not load documents"));
        setLoading(false);
      });

    unsubscribe = repository.subscribe(
      (next) => {
        if (!active) {
          return;
        }
        setItems(next);
        setLoading(false);
        setError(null);
      },
      (caught) => {
        if (!active) {
          return;
        }
        setError(caught.message);
        setLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [repository]);

  const save = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      const parsed = getCollectionConfig(name).schema.safeParse(data);
      if (!parsed.success) {
        throw new Error("Document is invalid");
      }
      const document = parsed.data;
      if (!isRecord(document)) {
        throw new Error("Document is invalid");
      }
      const next: AdminDocument = { ...document, id };
      await repository.upsert(id, next);
      setItems((current) => {
        const index = current.findIndex((item) => item.id === id);
        if (index < 0) {
          return [...current, next];
        }
        const copy = current.slice();
        copy[index] = next;
        return copy;
      });
    },
    [name, repository],
  );

  const remove = useCallback(
    async (id: string) => {
      await repository.delete(id);
      setItems((current) => current.filter((item) => item.id !== id));
    },
    [repository],
  );

  const reorder = useCallback(
    async (orderedIds: string[]) => {
      setItems((current) =>
        orderedIds.flatMap((id) => {
          const item = current.find((entry) => entry.id === id);
          return item ? [{ ...item, order: orderedIds.indexOf(id) }] : [];
        }),
      );
      await repository.reorder(orderedIds);
    },
    [repository],
  );

  return { items, loading, error, save, remove, reorder };
}
