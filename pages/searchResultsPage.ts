import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class SearchResultsPage extends BasePage {
  readonly productNames: Locator;

  constructor(page: Page) {
    super(page);
    this.productNames = page.locator(".product-item .product-title");
  }

  async getProductNames(): Promise<string[]> {
    await this.productNames.first().waitFor({ state: "visible" });
    return this.getAllTextsFromElements(this.productNames, "product names");
  }

  async getUnrelatedProductNames(value: string): Promise<string[]> {
    const names = await this.getProductNames();
    return names.filter(
      (name) => !name.toLowerCase().includes(value.toLowerCase()),
    );
  }
}

export default SearchResultsPage;