import { test, expect } from "@playwright/test";

test("home page shows site title", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Hunain Humail" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Thinking out loud." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Got something to build?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Trinnect" }),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: "Trinnect cover" })).toBeVisible();
});
