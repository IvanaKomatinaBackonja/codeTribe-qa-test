import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly computersCategoryLink: Locator;
  readonly desktopsSubcategoryLink: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator("#small-searchterms");
    this.searchButton = page.locator(".search-box-button");
    this.computersCategoryLink = page.locator('a:has-text("COMPUTERS")').first();
    this.desktopsSubcategoryLink = page.locator("h2[class='title'] a[title='Show products in category Desktops']");
  }

  async search(value: string): Promise<void> {
    await this.fill(this.searchInput, value, "search input");
    await this.click(this.searchButton, "search button");
  }

  async goToDesktopsCategory(): Promise<void> {
    await this.click(this.computersCategoryLink, '"Computers" category link');
    await this.click(this.desktopsSubcategoryLink,'"Desktops" subcategory link');
  }
}

export default HomePage;