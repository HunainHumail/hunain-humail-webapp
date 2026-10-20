"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { BlueprintLead, BlueprintLeadStatus } from "@/lib/schemas/blueprint";
import {
  filterBlueprintLeads,
  type BlueprintLeadFilters,
} from "@/lib/utils/filterBlueprintLeads";
import {
  listBlueprintLeads,
  setBlueprintLeadStatus,
  subscribeBlueprintLeads,
} from "@/services/blueprintLeads";

export interface UseBlueprintLeadsResult {
  items: BlueprintLead[];
  loading: boolean;
  error: string | null;
  filters: BlueprintLeadFilters;
  setFilters: (next: BlueprintLeadFilters) => void;
  filtered: BlueprintLead[];
  setStatus: (id: string, status: BlueprintLeadStatus) => Promise<void>;
  findById: (id: string) => BlueprintLead | undefined;
}

export function useBlueprintLeads(): UseBlueprintLeadsResult {
  const [items, setItems] = useState<BlueprintLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlueprintLeadFilters>({
    status: "all",
  });

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;

    listBlueprintLeads()
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
        setError(
          caught instanceof Error ? caught.message : "Could not load blueprints",
        );
        setLoading(false);
      });

    unsubscribe = subscribeBlueprintLeads(
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
  }, []);

  const filtered = useMemo(
    () => filterBlueprintLeads(items, filters),
    [items, filters],
  );

  const findById = useCallback(
    (id: string) => items.find((item) => item.id === id),
    [items],
  );

  const setStatus = useCallback(async (id: string, status: BlueprintLeadStatus) => {
    const previous = items;
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    try {
      await setBlueprintLeadStatus(id, status);
      toast.success("Lead status updated");
    } catch (caught: unknown) {
      setItems(previous);
      toast.error(
        caught instanceof Error ? caught.message : "Could not update status",
      );
    }
  }, [items]);

  return {
    items,
    loading,
    error,
    filters,
    setFilters,
    filtered,
    setStatus,
    findById,
  };
}
