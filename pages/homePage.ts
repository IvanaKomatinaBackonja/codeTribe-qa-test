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

  private categoryLink(name: string): Locator {
    return this.page.locator(".top-menu > li > a", { hasText: name });
  }

  private subcategoryLink(name: string): Locator {
    return this.page.locator(`h2.title a[title="Show products in category ${name}"]`);
  }

  async search(value: string): Promise<void> {
    await this.fill(this.searchInput, value, "search input");
    await this.click(this.searchButton, "search button");
    await this.page.waitForURL(/\/search/);
  }

  async goToCategory(category: string, subcategory?: string): Promise<void> {
    await this.click(this.categoryLink(category), `"${category}" category`);
    if (subcategory) {
      await this.click(this.subcategoryLink(subcategory), `"${subcategory}" subcategory`);
    }
  }
}

export default HomePage;