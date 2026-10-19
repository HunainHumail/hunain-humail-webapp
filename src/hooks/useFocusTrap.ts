"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex=\"-1\"])";

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1,
  );
}

export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const container = containerRef.current;
    if (container === null) {
      return undefined;
    }

    const previous = document.activeElement;
    const first = focusableElements(container)[0];
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") {
        return;
      }

      const trapped = containerRef.current;
      if (trapped === null) {
        return;
      }

      const items = focusableElements(trapped);
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (!firstItem || !lastItem) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [active, containerRef]);
}
