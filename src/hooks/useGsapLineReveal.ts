"use client";

import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LINE_SELECTOR = "[data-reveal-line]";

export function useGsapLineReveal(
  rootRef: RefObject<HTMLElement | null>,
): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const lines = Array.from(root.querySelectorAll<HTMLElement>(LINE_SELECTOR));
    if (lines.length === 0) {
      return undefined;
    }

    if (reducedMotion) {
      lines.forEach((line) => {
        line.style.transform = "none";
      });
      return undefined;
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    void (async () => {
      const gsap = (await import("gsap")).default;
      if (cancelled) {
        return;
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
          },
        );
      }, root);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [rootRef, reducedMotion]);
}
