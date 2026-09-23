import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class ProductDetailsPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator("h1[itemprop='name']");
    this.productPrice = page.locator('span[itemprop="price"]');
  }

  async getTitleText(): Promise<string> {
    return this.getTextFromElement(this.productTitle, "product title");
  }

  async getPriceText(): Promise<string> {
    return this.getTextFromElement(this.productPrice, "product price");
  }
}

export default ProductDetailsPage;