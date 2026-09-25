import { test, expect } from "../fixtures/baseFixture";
import { testData } from "../data/testData";

test.describe('Search', () => {
  test("TC-01 - Validate search returns only relevant products", async ({
    homePage,
    productListPage,
  }) => {
    await homePage.search(testData.search.term);

    const productCount = await productListPage.productItems.count();
    expect(productCount, "Search should return products").toBeGreaterThan(0);

    const productNames = await productListPage.getProductNames();
    expect(productNames.length, "Every product should have a title element").toBe(productCount);

    await test.step(`Product names: ${productNames.join(", ")}`, async () => {});


    const unrelatedProducts = await productListPage.getUnrelatedProductNames(testData.search.term);
    expect(unrelatedProducts, "No unrelated products should be found").toEqual([]);
  });

  test("TC-02 - Validate product name and price for each result", async ({
    homePage,
    productListPage,
  }) => {
    await homePage.search(testData.search.term);

    const productCount = await productListPage.productItems.count();
    expect(productCount, "Search should return products").toBeGreaterThan(0);

    const productNames = await productListPage.getProductNames();
    const productPrices = await productListPage.getProductPrices();

    expect(productNames.length, "Every product should have a title element").toBe(productCount);
    expect(productPrices.length, "Every product should have a price element").toBe(productCount);

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
    await homePage.search(testData.search.term);

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
     await homePage.goToCategory(testData.categories.computers.name, testData.categories.computers.subcategories.desktops.name);

    const productCount = await productListPage.productNames.count();
    expect(productCount).toBeGreaterThan(0);

    const priceCount = await productListPage.productPrices.count();
    expect(priceCount, `Expected ${productCount} prices, but found ${priceCount}`).toBe(productCount);

    const addToCartCount = await productListPage.addToCartButtons.count();
    expect(addToCartCount, `Expected ${productCount} Add to Cart buttons, but found ${addToCartCount}`).toBe(productCount);

    expect(await productListPage.allElementsAreVisible(productListPage.productNames), "All product titles should be visible").toBe(true);

    expect(await productListPage.allElementsAreVisible(productListPage.productPrices), "All product prices should be visible").toBe(true);

    expect(await productListPage.allElementsAreVisible(productListPage.addToCartButtons), "All Add to Cart buttons should be visible").toBe(true);
  });
});

test.describe("Product detail page", () => {
  // This test randomly selects a product using Math.floor(Math.random() * productNames.length).
  // Sometimes it lands on a product that has no "Add to Cart" button on the details page,
  // and the test fails there — intentionally flagging the bug already noted for the product list.
  test("TC-05 - Validate title, price, and 'Add to Cart' button are visible on product details page", async ({ homePage, productListPage, productDetailsPage }) => {
    await homePage.goToCategory(testData.categories.computers.name, testData.categories.computers.subcategories.desktops.name);

    const productNames = await productListPage.getProductNames();
    const productPrices = await productListPage.getProductPrices();

    const randomIndex = Math.floor(Math.random() * productNames.length);
    const selectedName = productNames[randomIndex];
    const selectedPrice = productPrices[randomIndex];

    await productListPage.openProductByName(selectedName);

    await expect(productDetailsPage.productTitle, "Product title should be visible").toBeVisible();
    await expect(productDetailsPage.productPrice, "Product price should be visible").toBeVisible();
    await expect(productDetailsPage.addToCartButton, "Add to Cart button should be visible").toBeVisible();

    const actualTitle = await productDetailsPage.getTitleText();
    expect(actualTitle, `Expected "${actualTitle}" to be "${selectedName}"`).toBe(selectedName);

    const actualPrice = await productDetailsPage.getPriceText();
    expect(actualPrice, `Expected "${actualPrice}" to be "${selectedPrice}"`).toBe(selectedPrice);

    const buttonText = await productDetailsPage.getAddToCartButtonText();
    expect(buttonText, `Expected "${buttonText}" to be "Add to cart"`).toBe("Add to cart");
  });
});

test.describe("Category", () => {
  test("TC-06 - Validate navigation to the 'Apparel & Shoes' category", async ({ page, homePage, productListPage }) => {
      await homePage.goToCategory(testData.categories.apparelAndShoes.name);

    await expect(page, `Expected to land on the "${testData.categories.apparelAndShoes.name}" category page (${testData.categories.apparelAndShoes.url})`).toHaveURL(testData.categories.apparelAndShoes.url);

    const categoryTitleText = await productListPage.getTextFromElement(productListPage.categoryTitle, "category title");
    expect(categoryTitleText, `Expected category title "${categoryTitleText}" to be "${testData.categories.apparelAndShoes.name}"`).toBe(testData.categories.apparelAndShoes.name);

    const breadcrumbText = await productListPage.getTextFromElement(productListPage.breadcrumbCategory, "breadcrumb");
    expect(breadcrumbText, `Expected breadcrumb "${breadcrumbText}" to be "${testData.categories.apparelAndShoes.name}"`).toBe(testData.categories.apparelAndShoes.name);
  });

  test("TC-07 - Validate pagination on desired category page works correctly", async ({ page, homePage, productListPage }) => {
     await homePage.goToCategory(testData.categories.apparelAndShoes.name);

    await productListPage.goToPageTwo();

    await expect(page, `Expected URL to contain "${testData.pagination.pageTwoUrlParam}"`).toHaveURL(new RegExp(testData.pagination.pageTwoUrlParam));
  });

  test("TC-08 - Validate products are displayed on both pages", async ({ homePage, productListPage }) => {
    await homePage.goToCategory(testData.categories.apparelAndShoes.name);

    const productNamesPageOne = await productListPage.getProductNames();
    expect(productNamesPageOne.length, "Page 1 should display products").toBeGreaterThan(0);

    await productListPage.goToPageTwo();

    const productNamesPageTwo = await productListPage.getProductNames();
    expect(productNamesPageTwo.length, "Page 2 should display products").toBeGreaterThan(0);

    expect(productNamesPageTwo, "Products on page 2 should not be the same as page 1").not.toEqual(productNamesPageOne);
  });
})

test.describe("Sort", () => {
  test("TC-09 - Validate that a sort option can be applied on the category page", async ({ homePage, productListPage }) => {
    await homePage.goToCategory(testData.categories.apparelAndShoes.name);

  await productListPage.selectSortOption(testData.sort.option);

  const selectedLabel = await productListPage.sortDropdown.locator("option:checked").textContent();
  expect(selectedLabel?.trim(), `Expected selected sort option to be "${testData.sort.option}"`).toBe(testData.sort.option);

  const pricesSorted = await productListPage.arePricesSortedAscending();
  expect(pricesSorted, "Prices should be sorted in ascending order").toBe(true);
  });
})