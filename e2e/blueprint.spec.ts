import { expect, test } from "@playwright/test";
import {
  expectNoHorizontalOverflow,
  isMobileProject,
  settleMotion,
} from "./support";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await settleMotion(page);
});

test("happy path generates blueprint and prefills contact", async ({ page }) => {
  const blueprint = page.locator("#blueprint");
  await expect(blueprint.getByRole("textbox", { name: /email/i })).toBeVisible();

  await blueprint.getByRole("textbox", { name: /email/i }).fill("visitor@example.com");
  await blueprint
    .getByRole("textbox", { name: /your idea/i })
    .fill("A booking app for a neighbourhood barber with slot reminders.");
  await blueprint.getByRole("button", { name: "Web", exact: true }).click();
  await blueprint.getByRole("button", { name: "Generate blueprint" }).click();

  await expect(blueprint.getByRole("status")).toBeVisible();
  await expect(blueprint.locator("figure svg[role='img']")).toHaveCount(3, {
    timeout: 15_000,
  });

  await blueprint.getByRole("button", { name: "Discuss this with Hunain" }).click();
  const contact = page.locator("#contact");
  await expect(contact).toBeInViewport();
  await expect(contact.getByRole("textbox", { name: /email/i })).toHaveValue(
    "visitor@example.com",
  );
  await expect(contact.getByRole("textbox", { name: /message/i })).toContainText(
    "Neighbour Cut",
  );

  await contact.getByRole("textbox", { name: /name/i }).fill("Test Visitor");
  await contact.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Thanks. Your message is on its way.")).toBeVisible();
});

test("invalid email shows inline error without loading status", async ({ page }) => {
  const blueprint = page.locator("#blueprint");
  await blueprint.getByRole("textbox", { name: /email/i }).fill("not-an-email");
  await blueprint
    .getByRole("textbox", { name: /your idea/i })
    .fill("A valid idea with enough characters here.");
  await blueprint.getByRole("button", { name: "Generate blueprint" }).click();
  await expect(page.getByText("Enter a valid email")).toBeVisible();
  await expect(blueprint.getByRole("status")).toHaveCount(0);
});

test("example chip fills idea only", async ({ page }) => {
  const blueprint = page.locator("#blueprint");
  await blueprint
    .getByRole("button", { name: /Use example: A booking app/i })
    .click();
  await expect(blueprint.getByRole("textbox", { name: /your idea/i })).not.toHaveValue("");
  await expect(blueprint.getByRole("textbox", { name: /email/i })).toHaveValue("");
});

test("mobile layout avoids horizontal overflow", async ({ page }, testInfo) => {
  test.skip(!isMobileProject(testInfo), "Mobile project only");
  await expectNoHorizontalOverflow(page);
  const screens = page.locator("#blueprint figure svg[role='img']");
  await expect(screens.first()).toBeVisible();
});
