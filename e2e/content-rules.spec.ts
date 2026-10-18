import { expect, test } from "@playwright/test";
import { featuredCaseStudies, settleMotion } from "./support";

const banned = [
  /hysab/i,
  /co[-\s]?founder/i,
  /\bcto\b/i,
  /studying/i,
  /certification/i,
] as const;

const routes = ["/", ...featuredCaseStudies.map((item) => `/work/${item.slug}`)];

test("public pages omit banned phrases", async ({ page }) => {
  await settleMotion(page);

  for (const route of routes) {
    await page.goto(route);
    const text = await page.evaluate(
      () => `${document.title}\n${document.body.textContent ?? ""}`,
    );

    for (const pattern of banned) {
      expect(text, `${route} matches ${pattern}`).not.toMatch(pattern);
    }
  }
});
