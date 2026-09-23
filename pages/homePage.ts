import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator("#small-searchterms");
    this.searchButton = page.locator(".search-box-button");
  }

  async search(value: string): Promise<void> {
    await this.fill(this.searchInput, value, "search input");
    await this.click(this.searchButton, "search button");
  }
}

export default HomePage;