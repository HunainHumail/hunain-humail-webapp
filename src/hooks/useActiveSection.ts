"use client";

import { useEffect, useState } from "react";

function hrefToId(href: string): string | null {
  if (!href.startsWith("#") || href.length < 2) {
    return null;
  }
  return href.slice(1);
}

export function useActiveSection(hrefs: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = hrefs
      .map(hrefToId)
      .filter((id): id is string => id !== null)
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.id;
        if (id) {
          setActive(`#${id}`);
        }
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [hrefs]);

  return active;
}
