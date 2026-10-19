import { expect, type Page, type TestInfo } from "@playwright/test";

export const featuredCaseStudies = [
  { slug: "trinnect", title: "Trinnect" },
  { slug: "terranzo", title: "Terranzo" },
  { slug: "my-float", title: "My Float by I-Sense" },
  { slug: "fast-brix", title: "Fast Brix" },
  { slug: "vigil", title: "Vigil" },
] as const;

export const allCaseStudies = [
  ...featuredCaseStudies,
  { slug: "wellspent", title: "Wellspent Screen Time SDK" },
  { slug: "white-label-vpn-sdk", title: "White Label VPN SDK" },
  { slug: "luviq", title: "LuvIQ" },
  { slug: "escrow-trakker-landlords", title: "Escrow Trakker for Landlords" },
  { slug: "escrow-trakker-lawyers", title: "Escrow Trakker for Lawyers" },
  { slug: "al-rayyan-tv", title: "Al Rayyan TV" },
  { slug: "banoon", title: "Banoon" },
  { slug: "bring-itt", title: "Bring itt" },
  { slug: "emdee", title: "Emdee Healthcare" },
  { slug: "lions-clubs-connect", title: "Lions Clubs Connect" },
  { slug: "savesor", title: "Savesor Smart Hotel Rooms" },
  { slug: "tecobi", title: "Tecobi" },
] as const;

export function isMobileProject(info: TestInfo): boolean {
  return info.project.use.isMobile === true;
}

export async function settleMotion(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const extra = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(extra).toBeLessThanOrEqual(1);
}

export async function showDubaiClock(page: Page): Promise<void> {
  const menu = page.getByRole("button", { name: "Open menu" });
  if (await menu.isVisible()) {
    await menu.click();
  }
}
