import { expect, test } from "@playwright/test";
import { settleMotion, showDubaiClock } from "./support";

test("shows Dubai time as DUBAI · latitude · HH:MM:SS", async ({ page }) => {
  await settleMotion(page);
  await page.goto("/");
  await showDubaiClock(page);

  await expect(
    page.getByText(/^DUBAI · 25\.20° N · \d{2}:\d{2}:\d{2}$/),
  ).toBeVisible();
});
