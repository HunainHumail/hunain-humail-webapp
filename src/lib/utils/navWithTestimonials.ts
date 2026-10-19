import type { NavItem } from "@/lib/schemas/siteSettings";

export const TESTIMONIALS_HREF = "/#testimonials";
export const TESTIMONIALS_NAV_LABEL = "Testimonials";

export function isTestimonialsNavHref(href: string): boolean {
  return href === TESTIMONIALS_HREF || href.endsWith("#testimonials");
}

function formatNavNumber(index: number): string {
  return String(index).padStart(2, "0");
}

function insertIndex(nav: readonly NavItem[]): number {
  const writing = nav.findIndex((item) => item.href.includes("writing"));
  if (writing >= 0) {
    return writing + 1;
  }
  const work = nav.findIndex((item) => item.href.includes("work"));
  if (work >= 0) {
    return work + 1;
  }
  const contact = nav.findIndex((item) => item.href.includes("contact"));
  return contact >= 0 ? contact : nav.length;
}

function withNumbers(nav: readonly NavItem[]): NavItem[] {
  return nav.map((item, index) => ({
    ...item,
    number: formatNavNumber(index + 1),
  }));
}

export function navWithTestimonials(
  nav: readonly NavItem[],
  hasTestimonials: boolean,
): NavItem[] {
  const without = nav.filter((item) => !isTestimonialsNavHref(item.href));
  if (!hasTestimonials) {
    return withNumbers(without);
  }

  const existing = nav.find((item) => isTestimonialsNavHref(item.href));
  const inserted: NavItem = existing ?? {
    number: "",
    label: TESTIMONIALS_NAV_LABEL,
    href: TESTIMONIALS_HREF,
  };
  const next = [...without];
  next.splice(insertIndex(without), 0, inserted);
  return withNumbers(next);
}
