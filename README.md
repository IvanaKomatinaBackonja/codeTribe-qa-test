# Codetribe QA Automation Task

## Project structure
Tests are located in `.spec.ts` files inside the `tests` directory. Page objects are located in the `pages` directory, test data in `data`, custom fixtures in `fixtures`, and helper functions in `utils`.

## Setup (Playwright)
### 1. Clone the repository
```
git clone git@github.com:IvanaKomatinaBackonja/codeTribe-qa-test.git
```
### 2. Install dependencies
```
npm install
npx playwright install
```
### 3. Run all tests

headed run
```
npm run test:headed
```
headless run
```
npm test
```
### 4. Run specific tests
headed run specific tests
```
npx playwright test --headed -g "test name"
```
headless run specific tests
```
npx playwright test -g "test name"
```
### 5. Run on a specific browser
```
npm run test:chrome
npm run test:firefox
npm run test:safari
```
### 6. View the HTML report
```
npm run test:report
```
**Note:** the HTML report is configured to open automatically after each run.

## Known failing tests (by design)
  Some tests intentionally fail because they detect real defects on the site.
  These are documented in the Bug Report.

- **TC-04 (Product list page)** — fails consistently: not every in-stock product in the "Desktops" category exposes an "Add to Cart" button in the list.
- **TC-05 (Product details page)** — fails intermittently: it selects a random product, and configurable products have no "Add to Cart" button on the details page.

  All other tests pass on Chromium, Firefox and WebKit.