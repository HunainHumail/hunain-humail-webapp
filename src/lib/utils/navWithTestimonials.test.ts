import { describe, expect, it } from "vitest";
import { siteSettingsSeed } from "@/lib/seed/settings";
import {
  navWithTestimonials,
  TESTIMONIALS_HREF,
  TESTIMONIALS_NAV_LABEL,
} from "./navWithTestimonials";

describe("navWithTestimonials", () => {
  it("keeps seed nav numbers when there are no testimonials", () => {
    const nav = navWithTestimonials(siteSettingsSeed.nav, false);
    expect(nav.map((item) => item.label)).toEqual(
      siteSettingsSeed.nav.map((item) => item.label),
    );
    expect(nav.some((item) => item.label === TESTIMONIALS_NAV_LABEL)).toBe(false);
    expect(nav.map((item) => item.number)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);
  });

  it("inserts Testimonials after Writing and renumbers Contact", () => {
    const nav = navWithTestimonials(siteSettingsSeed.nav, true);
    expect(nav.map((item) => item.label)).toEqual([
      "Story",
      "Now",
      "Work",
      "Writing",
      "Testimonials",
      "Contact",
    ]);
    expect(nav[4]).toEqual({
      number: "05",
      label: TESTIMONIALS_NAV_LABEL,
      href: TESTIMONIALS_HREF,
    });
    expect(nav[5]?.number).toBe("06");
    expect(nav[5]?.label).toBe("Contact");
  });

  it("hides a CMS testimonials item when the list is empty", () => {
    const nav = navWithTestimonials(
      [
        ...siteSettingsSeed.nav.slice(0, 4),
        { number: "05", label: "Testimonials", href: "/#testimonials" },
        { number: "06", label: "Contact", href: "/#contact" },
      ],
      false,
    );
    expect(nav.map((item) => item.label)).toEqual([
      "Story",
      "Now",
      "Work",
      "Writing",
      "Contact",
    ]);
    expect(nav[4]?.number).toBe("05");
  });
});
