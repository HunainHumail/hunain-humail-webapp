import { expect, type Page, type TestInfo } from "@playwright/test";

export const featuredCaseStudies = [
  { slug: "trinnect", title: "Trinnect", category: "ai-systems" },
  { slug: "terranzo", title: "Terranzo", category: "ai-systems" },
  { slug: "my-float", title: "My Float by I-Sense", category: "ai-systems" },
  { slug: "fast-brix", title: "Fast Brix", category: "ai-systems" },
  { slug: "vigil", title: "Vigil", category: "ai-systems" },
] as const;

export const allCaseStudies = [
  ...featuredCaseStudies,
  { slug: "wellspent", title: "Wellspent Screen Time SDK", category: "products" },
  { slug: "white-label-vpn-sdk", title: "White Label VPN SDK", category: "products" },
  { slug: "shopscope", title: "ShopScope", category: "products" },
  { slug: "luviq", title: "LuvIQ", category: "products" },
  { slug: "coachendo", title: "Coachendo", category: "ai-systems" },
  { slug: "boon-and-bliss", title: "Boon & Bliss", category: "products" },
  { slug: "tickfilm", title: "TickFilm", category: "products" },
  { slug: "high-end-crypto-demo", title: "High-End Crypto Demo", category: "products" },
  { slug: "escrow-trakker-landlords", title: "Escrow Trakker for Landlords", category: "products" },
  { slug: "escrow-trakker-lawyers", title: "Escrow Trakker for Lawyers", category: "products" },
  { slug: "omanoil", title: "OmanOil", category: "client-apps" },
  { slug: "royal-gas", title: "Royal Gas", category: "client-apps" },
  { slug: "al-rayyan-tv", title: "Al Rayyan TV", category: "client-apps" },
  { slug: "banoon", title: "Banoon", category: "client-apps" },
  { slug: "mh1", title: "MH1", category: "client-apps" },
  { slug: "emdee", title: "Emdee Healthcare", category: "client-apps" },
  { slug: "innerspark", title: "InnerSpark", category: "client-apps" },
  { slug: "bring-itt", title: "Bring itt", category: "client-apps" },
  { slug: "golflinks", title: "Golflinks", category: "client-apps" },
  { slug: "grocery", title: "Grocery App", category: "client-apps" },
  { slug: "lions-clubs-connect", title: "Lions Clubs Connect", category: "client-apps" },
  { slug: "savesor", title: "Savesor Smart Hotel Rooms", category: "client-apps" },
  { slug: "tecobi", title: "Tecobi", category: "client-apps" },
  { slug: "freelance-android", title: "Freelance Android", category: "client-apps" },
] as const;

export const homePreviewCaseStudies = [
  ...featuredCaseStudies,
  { slug: "wellspent", title: "Wellspent Screen Time SDK" },
  { slug: "white-label-vpn-sdk", title: "White Label VPN SDK" },
  { slug: "omanoil", title: "OmanOil" },
  { slug: "coachendo", title: "Coachendo" },
  { slug: "shopscope", title: "ShopScope" },
  { slug: "mh1", title: "MH1" },
  { slug: "royal-gas", title: "Royal Gas" },
] as const;

export function workCategoryCount(
  category: "ai-systems" | "products" | "client-apps",
): number {
  return allCaseStudies.filter((item) => item.category === category).length;
}

export function isMobileProject(info: TestInfo): boolean {
  return info.project.use.isMobile === true;
}

export async function settleMotion(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
}

export async function revealAllWork(page: Page): Promise<void> {
  const button = page.getByRole("button", { name: "Load more" });
  while (await button.isVisible()) {
    await button.click();
  }
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
