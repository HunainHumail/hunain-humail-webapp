"use client";

import { useEffect, useState } from "react";
import { countRecentHealthFailures } from "@/services/healthEvents";

export function useHealthFailureCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    countRecentHealthFailures()
      .then((next) => {
        if (active) {
          setCount(next);
        }
      })
      .catch(() => {
        if (active) {
          setCount(0);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return count;
}
