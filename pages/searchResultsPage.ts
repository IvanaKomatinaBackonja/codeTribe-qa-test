import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class SearchResultsPage extends BasePage {
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.productNames = page.locator(".product-item .product-title");
    this.productPrices = page.locator(".product-item .price.actual-price");
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

  async getProductPrices(): Promise<string[]> {
    return this.getAllTextsFromElements(this.productPrices, "product prices");
  }

  async getEmptyProductNames(): Promise<string[]> {
    const names = await this.getProductNames();
    return names.filter((name) => name.trim() === "");
  }

  async getInvalidPrices(): Promise<string[]> {
    const prices = await this.getProductPrices();
    return prices.filter((price) => {
      const normalized = price.replace(/[^\d.,]/g, "").replace(/,/g, "");
      const number = Number(normalized);
      return normalized === "" || isNaN(number) || number <= 0;
    });
  }
}

export default SearchResultsPage;