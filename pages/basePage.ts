import { Locator, Page, test } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Performs a click on the given locator.
   * @param locator     Playwright Locator (getByRole, getByText, getByLabel, itd.)
   * @param description Description of the element, shown in the report as "Click {description}"
   */
  async click(locator: Locator, description: string): Promise<void> {
    await test.step(`Click ${description}`, async () => {
      await locator.click();
    });
  }

  /**
   * Fills an input with the given value.
   * @param locator     Playwright Locator
   * @param value       The string to type into the element
   * @param description Description of the element, shown in the report as "Fill {description} with "value""
   */
  async fill(
    locator: Locator,
    value: string,
    description: string,
  ): Promise<void> {
    await test.step(`Fill ${description} with "${value}"`, async () => {
      await locator.fill(value);
    });
  }

  /**
   * Retrieves and trims the text content of all elements matching the locator.
   * @param locator     Playwright Locator
   * @param description Description of the elements, shown in the report as "Get all texts from {description}"
   */
  async getAllTextsFromElements(
    locator: Locator,
    description: string,
  ): Promise<string[]> {
    return await test.step(`Get all texts from ${description}`, async () => {
      return (await locator.allTextContents()).map((t) => t.trim());
    });
  }

  /**
   * Retrieves and returns the trimmed text content of a locator.
   * @param locator     Playwright Locator
   * @param description Description of the element, shown in the report as "Get text from {description}"
   */
  async getTextFromElement(
    locator: Locator,
    description: string,
  ): Promise<string> {
    return await test.step(`Get text from ${description}`, async () => {
      const raw = await locator.textContent();
      return raw?.trim() ?? "";
    });
  }

  /**
   * Checks whether all elements matching the locator are visible.
   * @param locator Playwright Locator (collection of elements)
   */
  async allElementsAreVisible(locator: Locator): Promise<boolean> {
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
      if (!(await locator.nth(i).isVisible())) return false;
    }
    return true;
  }
}