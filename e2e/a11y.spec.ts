import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { settleMotion } from "./support";

const routes = ["/", "/work", "/work/trinnect"] as const;

test.beforeEach(async ({ page }) => {
  await settleMotion(page);
});

for (const route of routes) {
  test(`${route} has no serious or critical axe violations`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    );

    expect(
      blocking.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  });
}
