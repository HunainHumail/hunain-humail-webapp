import { expect, test } from "@playwright/test";
import {
  expectNoHorizontalOverflow,
  isMobileProject,
  settleMotion,
} from "./support";

const sections = [
  {
    id: "#story",
    index: "01",
    heading: "Story",
    seed: "Android freelancer",
    nav: "Story",
  },
  {
    id: "#now",
    index: "02",
    heading: "This month.",
    seed: "Agentic workflows",
    nav: "Now",
  },
  {
    id: "#work",
    index: "03",
    heading: "Things I've built.",
    seed: "Trinnect",
    nav: "Work",
  },
  {
    id: "#writing",
    index: "04",
    heading: "Thinking out loud.",
    seed: "AI-native delivery",
    nav: "Writing",
  },
  {
    id: "#contact",
    index: "05",
    heading: "Got something to build?",
    seed: "raohunain@hotmail.com",
    nav: "Contact",
  },
] as const;

test.beforeEach(async ({ page }) => {
  await settleMotion(page);
});

test("renders sections 01-05 from seed content with one heading", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("heading", { level: 1, name: "Hunain Humail" }),
  ).toBeVisible();
  await expect(page.getByText("hunain — genai engineer")).toBeVisible();

  for (const section of sections) {
    const region = page.locator(section.id);
    await expect(region).toContainText(section.index);
    await expect(
      region.getByRole("heading", { name: section.heading }),
    ).toBeVisible();
    await expect(region.getByText(section.seed).first()).toBeVisible();
  }
});

test("desktop nav anchors scroll to each section", async ({ page }, info) => {
  test.skip(isMobileProject(info), "desktop project only");
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const section of sections) {
    if (section.nav === "Work") {
      continue;
    }
    await nav.getByRole("link", { name: section.nav }).click();
    await expect(page).toHaveURL(new RegExp(`${section.id}$`));
    await expect(page.locator(section.id)).toBeInViewport();
  }

  await nav.getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "All projects" }),
  ).toBeVisible();
});

test("mobile menu reaches sections without horizontal overflow", async ({
  page,
}, info) => {
  test.skip(!isMobileProject(info), "mobile project only");
  await page.goto("/");
  await expectNoHorizontalOverflow(page);

  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  const nav = page.getByRole("navigation", { name: "Mobile primary" });
  await expect(nav).toBeVisible();
  await expectNoHorizontalOverflow(page);

  for (const section of sections) {
    if (section.nav === "Work") {
      continue;
    }
    if (!(await nav.isVisible())) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(nav).toBeVisible();
    }
    await nav.getByRole("link", { name: section.nav }).click();
    await expect(page).toHaveURL(new RegExp(`${section.id}$`));
    await expect(page.locator(section.id)).toBeInViewport();
  }

  if (!(await nav.isVisible())) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(nav).toBeVisible();
  }
  await nav.getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "All projects" }),
  ).toBeVisible();
});
