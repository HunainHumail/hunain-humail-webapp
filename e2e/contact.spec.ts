import { expect, test } from "@playwright/test";
import { settleMotion } from "./support";

test("shows validation errors, then a mocked success", async ({ page }) => {
  await settleMotion(page);
  await page.goto("/#contact");

  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Name is required")).toBeVisible();
  await expect(page.getByText("Enter a valid email")).toBeVisible();
  await expect(
    page.getByText("Message must be at least 10 characters"),
  ).toBeVisible();

  await page.getByRole("textbox", { name: "Name" }).fill("Ada Lovelace");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page.getByRole("combobox", { name: "Topic" }).selectOption("Freelance");
  await page
    .getByRole("textbox", { name: "Message" })
    .fill("I would like to build an agentic workflow.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toHaveText(
    "Thanks. Your message is on its way.",
  );
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toHaveCount(0);
});
