import { test as base } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { SearchResultsPage } from "../pages/searchResultsPage";

type Pages = {
  gotoHomePage: void;
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
};

export const test = base.extend<Pages>({
  gotoHomePage: [
    async ({ page }, use) => {
      await page.goto("/");
      await use();
    },
    { auto: true },
  ],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
});

export { expect } from "@playwright/test";
