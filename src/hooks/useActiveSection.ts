"use client";

import { useEffect, useState } from "react";

function hrefToId(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex < 0 || hashIndex === href.length - 1) {
    return null;
  }
  return href.slice(hashIndex + 1);
}

export function useActiveSection(hrefs: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const tracked = hrefs.flatMap((href) => {
      const id = hrefToId(href);
      if (!id) {
        return [];
      }
      const element = document.getElementById(id);
      if (!element) {
        return [];
      }
      return [{ href, element }];
    });

    if (tracked.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const target = visible[0]?.target;
        const match = tracked.find((item) => item.element === target);
        if (match) {
          setActive(match.href);
        }
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    );

    for (const item of tracked) {
      observer.observe(item.element);
    }
    return () => observer.disconnect();
  }, [hrefs]);

  return active;
}
