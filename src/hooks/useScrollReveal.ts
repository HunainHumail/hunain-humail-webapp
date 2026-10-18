"use client";

import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ITEM_SELECTOR = "[data-reveal]";

export function useScrollReveal(rootRef: RefObject<HTMLElement | null>): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const items = Array.from(root.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    if (items.length === 0) {
      return undefined;
    }

    if (reducedMotion) {
      items.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
      return undefined;
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    void (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) {
        return;
      }
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }, root);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [rootRef, reducedMotion]);
}
