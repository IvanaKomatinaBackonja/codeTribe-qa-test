import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { isAscending } from "../utils/sorting";

export class ProductListPage extends BasePage {
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;
  readonly categoryTitle: Locator;
  readonly breadcrumbCategory: Locator;
  readonly pageTwoLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator(".product-item");
    this.productNames = page.locator(".product-item .product-title");
    this.productPrices = page.locator(".product-item .price.actual-price");
    this.addToCartButtons = page.locator(".product-box-add-to-cart-button");
    this.categoryTitle = page.getByRole("heading", { name: "Apparel & Shoes" });
    this.breadcrumbCategory = page.locator(".breadcrumb").getByText("Apparel & Shoes");
    this.pageTwoLink = page.getByRole("link", { name: "2" });
    this.sortDropdown = page.locator("#products-orderby");
  }

  async getProductNames(): Promise<string[]> {
    await this.productNames.first().waitFor({ state: "visible" });
    return this.getAllTextsFromElements(this.productNames, "product names");
  }

  async getUnrelatedProductNames(value: string): Promise<string[]> {
    const names = await this.getProductNames();
    return names.filter((name) => !name.toLowerCase().includes(value.toLowerCase()));
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

  async openProductByName(name: string): Promise<void> {
    await this.click(this.productNames.filter({ hasText: name }), `product "${name}"`);
  }

  async goToPageTwo(): Promise<void> {
    await this.click(this.pageTwoLink, "page 2 link");
  }

  async selectSortOption(optionText: string): Promise<void> {
    await this.selectOption(this.sortDropdown, optionText, "sort dropdown");
    await this.page.waitForURL(/orderby=/);
  }

  async arePricesSortedAscending(): Promise<boolean> {
    const prices = await this.getProductPrices();
    const numericPrices = prices.map((p) => parseFloat(p.replace(/[^\d.]/g, "")));
    return isAscending(numericPrices);
  }
}

export default ProductListPage;