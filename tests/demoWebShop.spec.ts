import { test, expect } from "../fixtures/baseFixture";
import { testData } from "../data/testData";

test.describe('Search', () => {
  test("TC-01 - Validate search returns only relevant products", async ({
    homePage,
    productListPage,
  }) => {
    await homePage.search(testData.searchTerm);

    const productNames = await productListPage.getProductNames();

    expect(productNames.length).toBeGreaterThan(0);

    await test.step(`Product names: ${productNames.join(", ")}`, async () => {});


    const unrelatedProducts = await productListPage.getUnrelatedProductNames(
      testData.searchTerm,
    );
    expect(unrelatedProducts, "No unrelated products should be found").toEqual([]);
  });

  test("TC-02 - Validate product name and price for each result", async ({
    homePage,
    productListPage,
  }) => {
    await homePage.search(testData.searchTerm);

    const productNames = await productListPage.getProductNames();
    const productPrices = await productListPage.getProductPrices();

    expect(productNames.length).toBeGreaterThan(0);
    expect(productPrices.length).toBe(productNames.length);

    const emptyNames = await productListPage.getEmptyProductNames();
    expect(emptyNames, "No empty product names should be found").toEqual([]);

    const invalidPrices = await productListPage.getInvalidPrices();
    expect(invalidPrices, "No invalid prices should be found").toEqual([]);
  });


  test("TC-03 - Validate that a product details page opens from the search results", async ({
    homePage,
    productListPage,
    productDetailsPage,
  }) => {
    await homePage.search(testData.searchTerm);

    const productNames = await productListPage.getProductNames();
    const productPrices = await productListPage.getProductPrices();

    const randomIndex = Math.floor(Math.random() * productNames.length);
    const selectedName = productNames[randomIndex];
    const selectedPrice = productPrices[randomIndex];

    await test.step(`Selected product: ${selectedName}, price: ${selectedPrice}`, async () => {});

    await productListPage.openProductByName(selectedName);

    const actualTitle = await productDetailsPage.getTitleText();
    expect(actualTitle, `Expected "${actualTitle}" to be "${selectedName}"`).toBe(selectedName);


    const actualPrice = await productDetailsPage.getPriceText();
    expect(actualPrice,`Expected "${actualPrice}" to be "${selectedPrice}"`).toBe(selectedPrice);
  });
});

test.describe('Product list page', () => {
  // At the time of writing, not all products expose an "Add to Cart" button in the list.
  // Each product missing the button is in stock, so this is treated as a bug (test intentionally fails).
  test("TC-04 - Validate title, price, and 'Add to Cart' button are visible on product list page", async ({
    homePage,
    productListPage,
  }) => {
    await homePage.goToDesktopsCategory();

    const productCount = await productListPage.productNames.count();
    expect(productCount).toBeGreaterThan(0);

    const priceCount = await productListPage.productPrices.count();
    expect(priceCount, `Expected ${productCount} prices, but found ${priceCount}`).toBe(productCount);

    expect(await productListPage.allElementsAreVisible(productListPage.productNames), "All product titles should be visible").toBe(true);

    expect(await productListPage.allElementsAreVisible(productListPage.productPrices), "All product prices should be visible").toBe(true);

    const addToCartCount = await productListPage.addToCartButtons.count();
    expect(addToCartCount, `Expected ${productCount} Add to Cart buttons, but found ${addToCartCount}`).toBe(productCount);
  });
});