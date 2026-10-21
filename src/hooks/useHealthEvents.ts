"use client";

import { useEffect, useState } from "react";
import type { HealthEvent } from "@/lib/schemas/healthEvent";
import { listHealthEvents } from "@/services/healthEvents";

export interface UseHealthEventsResult {
  items: HealthEvent[];
  loading: boolean;
  error: string | null;
}

export function useHealthEvents(): UseHealthEventsResult {
  const [items, setItems] = useState<HealthEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listHealthEvents()
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
          caught instanceof Error ? caught.message : "Could not load health events",
        );
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { items, loading, error };
}
