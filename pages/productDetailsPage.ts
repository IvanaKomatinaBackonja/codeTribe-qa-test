import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class ProductDetailsPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator("h1[itemprop='name']");
    this.productPrice = page.locator('span[itemprop="price"]');
    this.addToCartButton = page.locator(".add-to-cart-button");
  }

  async getTitleText(): Promise<string> {
    return this.getTextFromElement(this.productTitle, "product title");
  }

  async getPriceText(): Promise<string> {
    return this.getTextFromElement(this.productPrice, "product price");
  }

  async getAddToCartButtonText(): Promise<string> {
    return (await this.getAttribute(this.addToCartButton, "value", "Add to Cart button")) ?? "";
  }
}

export default ProductDetailsPage;