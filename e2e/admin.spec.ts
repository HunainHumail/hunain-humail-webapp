import { expect, test } from "@playwright/test";

test("signed-out admin shows sign-in, not the editors, and noindex", async ({
  page,
}) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in with Google" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Firebase not configured" }),
  ).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Admin" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Profile" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Messages" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Blueprints" })).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/i,
  );
});

test("signed-out admin blueprints shows sign-in guard", async ({ page }) => {
  await page.goto("/admin/blueprints");

  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/i,
  );
});
