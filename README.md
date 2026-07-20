# Playwright Advanced Test Automation

![Playwright Tests](https://github.com/Antilla12/Playwright/actions/workflows/playwright.yml/badge.svg)

An advanced Playwright automation suite covering the full range of the framework's capabilities — from core UI testing to authentication reuse, visual regression, API testing, accessibility checks, and BDD-style testing with Cucumber. Built on [SauceDemo](https://www.saucedemo.com) as the primary target application.

## What's covered

Over 25 spec files, each focused on a specific Playwright capability:

| Area | Files |
|---|---|
| Core flows | `login.spec.js`, `inventory.spec.js`, `checkout.spec.js` |
| Auth & sessions | `auth-reuse.spec.js`, `storage.spec.js`, `isolation.spec.js` |
| Waiting & retries | `waiting.spec.js`, `retry.spec.js` |
| Network | `network.spec.js`, `mocking.spec.js`, `api.spec.js` |
| Visual & screenshots | `visual.spec.js`, `screenshots.spec.js`, `pdf.spec.js` |
| Interaction patterns | `dropdown.spec.js`, `keyboard.spec.js`, `dragdrop.spec.js`, `iframe.spec.js`, `multitab.spec.js` |
| Environment & config | `env-demo.spec.js`, `geolocation.spec.js`, `mobile.spec.js` |
| Accessibility | `accessibility.spec.js` (via `@axe-core/playwright`) |
| Performance | `performance.spec.js` |
| Test design | `fixtures-demo.spec.js`, `tagged.spec.js` |

## BDD testing with Cucumber

In addition to the Playwright test suite, this repo includes a Gherkin/Cucumber layer for behavior-driven testing:

```
cucumber/
├── features/
│   ├── login.feature      # valid/invalid login, locked-out user, scenario outline
│   └── cart.feature       # add/remove items, multi-item cart, full checkout flow
└── steps/
    ├── login.steps.js
    └── cart.steps.js
```

Run with:
```bash
npm run cucumber
```

## Project structure

```
├── pages/                  # Page Object Model classes
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── cucumber/                # Gherkin features + step definitions
├── tests/                   # Playwright spec files (25+, see table above)
├── fixtures.js               # Custom fixtures injecting page objects into tests
├── global-setup.js           # Logs in once, saves session to auth.json
├── my-reporter.js             # Custom console reporter (pass/fail/skip summary)
├── auth.json                  # Saved auth state, reused across tests
├── playwright.config.js
├── cucumber.json
├── babel.config.json
└── .github/workflows/playwright.yml   # Sharded CI across 2 shards
```

## Key techniques demonstrated

- **Auth state reuse** — `global-setup.js` logs in once before the whole run and saves cookies/localStorage to `auth.json`; every test starts already authenticated via `storageState` in the config, instead of re-logging in per test
- **Custom fixtures** (`fixtures.js`) — page objects (`loginPage`, `productsPage`, `cartPage`, `checkoutPage`) injected directly into tests, no manual instantiation needed
- **Custom reporter** (`my-reporter.js`) — a hand-written Playwright reporter that prints a live pass/fail/skip summary during the run
- **Multi-format reporting** — HTML, custom console reporter, and Allure all run simultaneously
- **Cross-browser + cross-device** — Chromium, Firefox, WebKit, plus Mobile Chrome (Pixel 5) and Mobile Safari (iPhone 12) via device emulation
- **Visual regression** — baseline screenshots for login and inventory pages across all three desktop engines, auto-updated in CI before each test run
- **BDD/Gherkin** — parallel Cucumber suite covering the same core flows in plain-language scenarios, including a Scenario Outline for data-driven login attempts
- **API testing**, **accessibility auditing**, **network mocking**, **PDF generation**, **geolocation**, **iframe/multi-tab handling**

## Running tests

```bash
npm install
npx playwright install

# Run the full Playwright suite (headless)
npx playwright test

# Run a specific spec
npx playwright test tests/checkout.spec.js

# Run a single browser or device project
npx playwright test --project=chromium
npx playwright test --project="Mobile Safari"

# Run the Cucumber/BDD suite
npm run cucumber

# View reports
npx playwright show-report
npx allure generate allure-results --clean -o allure-report && npx allure open allure-report
```

> **Note:** In cloud/CI environments without a display (e.g. GitHub Codespaces), run headless — don't use `--headed` or `--ui`.

### Environment variables

Tests read `BASE_URL`, `TEST_USERNAME`, and `TEST_PASSWORD` (see `.github/workflows/playwright.yml`). Create a local `.env` file (loaded via `dotenv`) for local runs:

```
BASE_URL=https://www.saucedemo.com
TEST_USERNAME=standard_user
TEST_PASSWORD=secret_sauce
```

## CI

GitHub Actions runs the full suite on every push and pull request to `main`, **sharded across 2 parallel jobs** for speed, with visual snapshots refreshed before each run and HTML reports uploaded as artifacts. See the badge above and the [Actions tab](https://github.com/Antilla12/Playwright/actions).

## Notes

- `auth.json`, `allure-report/`, `allure-results/`, `cucumber-report.html`, and `screenshots/` are generated artifacts — consider adding any not already in `.gitignore` to keep the repo clean.
