import { test, expect } from "../fixtures/baseFixture";
import { testData } from "../data/testData";

test.describe('Search', () => {
  test("Validate search returns only relevant products", async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search(testData.searchTerm);

    const productNames = await searchResultsPage.getProductNames();

    expect(productNames.length).toBeGreaterThan(0);

    await test.step(`Product names: ${productNames.join(", ")}`, async () => {});


    const unrelatedProducts = await searchResultsPage.getUnrelatedProductNames(
      testData.searchTerm,
    );
    expect(unrelatedProducts, "No unrelated products should be found").toEqual([]);
  });

  test("Validate product name and price for each result", async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.search(testData.searchTerm);

    const productNames = await searchResultsPage.getProductNames();
    const productPrices = await searchResultsPage.getProductPrices();

    expect(productNames.length).toBeGreaterThan(0);
    expect(productPrices.length).toBe(productNames.length);

    const emptyNames = await searchResultsPage.getEmptyProductNames();
    expect(emptyNames, "No empty product names should be found").toEqual([]);

    const invalidPrices = await searchResultsPage.getInvalidPrices();
    expect(invalidPrices, "No invalid prices should be found").toEqual([]);
  });


  test("Validate that a product details page opens from the search results", async ({
    homePage,
    searchResultsPage,
    productDetailsPage,
  }) => {
    await homePage.search(testData.searchTerm);

    const productNames = await searchResultsPage.getProductNames();
    const productPrices = await searchResultsPage.getProductPrices();

    const randomIndex = Math.floor(Math.random() * productNames.length);
    const selectedName = productNames[randomIndex];
    const selectedPrice = productPrices[randomIndex];

    await test.step(`Selected product: ${selectedName}, price: ${selectedPrice}`, async () => {});

    await searchResultsPage.openProductByName(selectedName);

    const actualTitle = await productDetailsPage.getTitleText();
    expect(actualTitle, `Expected "${actualTitle}" to be "${selectedName}"`).toBe(selectedName);


    const actualPrice = await productDetailsPage.getPriceText();
    expect(actualPrice,`Expected "${actualPrice}" to be "${selectedPrice}"`).toBe(selectedPrice);
  });
});