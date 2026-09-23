import { test, expect } from "../fixtures/baseFixture";
import { testData } from "../data/testData";

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
