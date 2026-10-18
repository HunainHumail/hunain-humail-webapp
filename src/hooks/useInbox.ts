"use client";

import { useCallback, useEffect, useState } from "react";
import type { InboxMessage } from "@/lib/schemas/inboxMessage";
import { listInbox, markInboxRead, subscribeInbox } from "@/services/inbox";

export interface UseInboxResult {
  items: InboxMessage[];
  loading: boolean;
  error: string | null;
  markRead: (id: string) => Promise<void>;
}

export function useInbox(): UseInboxResult {
  const [items, setItems] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;

    listInbox()
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
          caught instanceof Error ? caught.message : "Could not load messages",
        );
        setLoading(false);
      });

    unsubscribe = subscribeInbox(
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

  const markRead = useCallback(async (id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    try {
      await markInboxRead(id);
    } catch (caught: unknown) {
      setError(
        caught instanceof Error ? caught.message : "Could not update the message",
      );
    }
  }, []);

  return { items, loading, error, markRead };
}
