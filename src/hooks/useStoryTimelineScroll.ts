"use client";

import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface UseStoryTimelineScrollOptions {
  trackRef: RefObject<HTMLElement | null>;
  lineRef: RefObject<HTMLElement | null>;
}

const ITEM_SELECTOR = "[data-timeline-item]";

export function useStoryTimelineScroll({
  trackRef,
  lineRef,
}: UseStoryTimelineScrollOptions): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    const line = lineRef.current;
    if (!track || !line) {
      return undefined;
    }

    const items = Array.from(
      track.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
    );

    if (items.length === 0) {
      return undefined;
    }

    if (reducedMotion) {
      line.style.transform = "scaleY(1)";
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
        gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(items, { opacity: 0, y: 28 });

        gsap.to(line, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top 75%",
            end: "bottom 65%",
            scrub: true,
          },
        });

        items.forEach((item) => {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }, track);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [trackRef, lineRef, reducedMotion]);
}
