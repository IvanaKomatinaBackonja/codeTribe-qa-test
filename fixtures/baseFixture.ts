import { test as base } from "@playwright/test";

type Pages = {
  gotoHomePage: void;
};

export const test = base.extend<Pages>({
  gotoHomePage: [
    async ({ page }, use) => {
      await page.goto("/");
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
