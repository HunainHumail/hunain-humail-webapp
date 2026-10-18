import { expect, test } from "@playwright/test";
import {
  allCaseStudies,
  expectNoHorizontalOverflow,
  featuredCaseStudies,
  isMobileProject,
  settleMotion,
} from "./support";

test.beforeEach(async ({ page }) => {
  await settleMotion(page);
});

test("home work defaults to every project", async ({ page }) => {
  await page.goto("/#work");
  const work = page.locator("#work");

  await expect(
    work.getByRole("button", { name: `All (${allCaseStudies.length})`, exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    work.getByRole("link", {
      name: `View all projects (${allCaseStudies.length})`,
    }),
  ).toHaveAttribute("href", "/work");

  for (const item of allCaseStudies) {
    await expect(
      work.getByRole("heading", { level: 3, name: item.title }),
    ).toBeVisible();
  }
});

test("work index lists every project", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("heading", { level: 1, name: "All projects" }),
  ).toBeVisible();

  const work = page.locator("#all-projects");
  await expect(
    work.getByRole("button", { name: `All (${allCaseStudies.length})`, exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(work.getByRole("heading", { level: 3 })).toHaveCount(
    allCaseStudies.length,
  );

  for (const item of allCaseStudies) {
    await expect(
      work.getByRole("heading", { level: 3, name: item.title }),
    ).toBeVisible();
  }
});

test("filters case studies by category", async ({ page }) => {
  await page.goto("/work");
  const work = page.locator("#all-projects");

  await expect(
    work.getByRole("heading", { level: 3, name: "Trinnect" }),
  ).toBeVisible();

  await work.getByRole("button", { name: "Products (5)", exact: true }).click();
  await expect(
    work.getByRole("button", { name: "Products (5)", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    work.getByRole("heading", { level: 3, name: "Wellspent Screen Time SDK" }),
  ).toBeVisible();
  await expect(
    work.getByRole("heading", { level: 3, name: "Trinnect" }),
  ).toHaveCount(0);

  await work.getByRole("button", { name: "Client apps (7)", exact: true }).click();
  await expect(
    work.getByRole("heading", { level: 3, name: "Al Rayyan TV" }),
  ).toBeVisible();
  await expect(
    work.getByRole("heading", { level: 3, name: "Wellspent Screen Time SDK" }),
  ).toHaveCount(0);

  await work.getByRole("button", { name: "AI systems (5)", exact: true }).click();
  await expect(
    work.getByRole("heading", { level: 3, name: "Trinnect" }),
  ).toBeVisible();
  await expect(
    work.getByRole("heading", { level: 3, name: "Al Rayyan TV" }),
  ).toHaveCount(0);

  await work
    .getByRole("button", { name: `All (${allCaseStudies.length})`, exact: true })
    .click();
  await expect(
    work.getByRole("heading", { level: 3, name: "Trinnect" }),
  ).toBeVisible();
  await expect(
    work.getByRole("heading", { level: 3, name: "Wellspent Screen Time SDK" }),
  ).toBeVisible();
  await expect(work.getByRole("heading", { level: 3 })).toHaveCount(
    allCaseStudies.length,
  );
});

test("opens every featured case study", async ({ page }) => {
  for (const item of featuredCaseStudies) {
    await test.step(item.slug, async () => {
      await page.goto("/work");
      await page
        .locator("#all-projects")
        .getByRole("link", { name: item.title })
        .click();
      await expect(page).toHaveURL(new RegExp(`/work/${item.slug}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByRole("heading", { level: 1, name: item.title }),
      ).toBeVisible();
      await expect(page.getByText("GenAI engineer").first()).toBeVisible();
      await expect(page.getByRole("link", { name: "Back to work" })).toHaveAttribute(
        "href",
        "/work",
      );
    });
  }
});

test("case study page has no horizontal overflow on mobile", async ({
  page,
}, info) => {
  test.skip(!isMobileProject(info), "mobile project only");
  await page.goto("/work/trinnect");
  await expect(
    page.getByRole("heading", { level: 1, name: "Trinnect" }),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
