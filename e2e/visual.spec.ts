import { expect, test } from "@playwright/test";

const visualOrigin = process.env.VISUAL_ORIGIN ?? "/";

test.describe("hero visual polish", () => {
  test("desktop 1440: display type and terminal width", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("hh-theme", "light");
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(visualOrigin, { waitUntil: "load" });

    const heading = page.getByRole("heading", { level: 1, name: /Hunain/i });
    await expect(heading).toBeVisible();

    const fontSize = await heading.evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize),
    );
    expect(fontSize).toBeGreaterThanOrEqual(110);

    const terminal = page.getByRole("group", { name: "Terminal" });
    await expect(terminal).toBeVisible();
    const terminalWidth = await terminal.evaluate(
      (el) => el.getBoundingClientRect().width,
    );
    expect(terminalWidth).toBeGreaterThanOrEqual(420);
  });

  test("mobile 390: display type and no horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(visualOrigin, { waitUntil: "load" });

    const heading = page.getByRole("heading", { level: 1, name: /Hunain/i });
    await expect(heading).toBeVisible();

    const fontSize = await heading.evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize),
    );
    expect(fontSize).toBeGreaterThanOrEqual(56);

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(390);
  });
});
