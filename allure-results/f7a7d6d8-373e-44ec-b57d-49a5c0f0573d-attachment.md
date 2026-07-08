# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.js >> inventory page has no accessibility violations
- Location: tests/accessibility.spec.js:29:5

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  [{"description": "Ensure buttons have discernible text", "help": "Buttons must have discernible text", "helpUrl": "https://dequeuniversity.com/rules/axe/4.12/button-name?application=playwright", "id": "button-name", "impact": "critical", "nodes": [{"all": [], "any": [{"data": null, "id": "button-has-visible-text", "impact": "critical", "message": "Element does not have inner text that is visible to screen readers", "relatedNodes": []}, {"data": null, "id": "aria-label", "impact": "critical", "message": "aria-label attribute does not exist or is empty", "relatedNodes": []}, {"data": null, "id": "aria-labelledby", "impact": "critical", "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-title", "impact": "critical", "message": "Element has no title attribute", "relatedNodes": []}, {"data": null, "id": "implicit-label", "impact": "critical", "message": "Element does not have an implicit (wrapped) <label>", "relatedNodes": []}, {"data": null, "id": "explicit-label", "impact": "critical", "message": "Element does not have an explicit <label>", "relatedNodes": []}, {"data": null, "id": "presentational-role", "impact": "critical", "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "relatedNodes": []}], "failureSummary": "Fix any of the following:
  Element does not have inner text that is visible to screen readers
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<button type=\"button\" class=\"error-button\" data-test=\"error-button\">", "impact": "critical", "none": [], "target": ["button"]}], "tags": ["cat.name-role-value", "wcag2a", "wcag412", "section508", "section508.22.a", "TTv5", "TT6.a", "EN-301-549", "EN-9.4.1.2", "ACT", …]}]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - generic [ref=e5]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - textbox "Username" [ref=e11]
        - img [ref=e12]
      - generic [ref=e14]:
        - textbox "Password" [ref=e15]
        - img [ref=e16]
      - 'heading "Epic sadface: You can only access ''/inventory.html'' when you are logged in." [level=3] [ref=e19]':
        - button [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - text: "Epic sadface: You can only access '/inventory.html' when you are logged in."
      - button "Login" [ref=e23] [cursor=pointer]
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Accepted usernames are:" [level=4] [ref=e27]
        - text: standard_user
        - text: locked_out_user
        - text: problem_user
        - text: performance_glitch_user
        - text: error_user
        - text: visual_user
      - generic [ref=e28]:
        - heading "Password for all users:" [level=4] [ref=e29]
        - text: secret_sauce
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | // list of known violations we accept because saucedemo is a demo site
  5  | const knownViolations = [
  6  |   'landmark-one-main',
  7  |   'page-has-heading-one',
  8  |   'region',
  9  |   'select-name',
  10 | ];
  11 | 
  12 | test('login page has no accessibility violations', async ({ page }) => {
  13 |   await page.goto('https://www.saucedemo.com');
  14 | 
  15 |   const accessibilityResults = await new AxeBuilder({ page }).analyze();
  16 | 
  17 |   // filter out known violations
  18 |   const newViolations = accessibilityResults.violations.filter(
  19 |     (v) => !knownViolations.includes(v.id)
  20 |   );
  21 | 
  22 |   console.log('Known violations found:', accessibilityResults.violations.length);
  23 |   console.log('New unexpected violations:', newViolations.length);
  24 | 
  25 |   // only fail on NEW unexpected violations
  26 |   expect(newViolations).toHaveLength(0);
  27 | });
  28 | 
  29 | test('inventory page has no accessibility violations', async ({ page }) => {
  30 |   await page.goto('https://www.saucedemo.com/inventory.html');
  31 | 
  32 |   const accessibilityResults = await new AxeBuilder({ page }).analyze();
  33 | 
  34 |   const newViolations = accessibilityResults.violations.filter(
  35 |     (v) => !knownViolations.includes(v.id)
  36 |   );
  37 | 
  38 |   console.log('Known violations found:', accessibilityResults.violations.length);
  39 |   console.log('New unexpected violations:', newViolations.length);
  40 | 
> 41 |   expect(newViolations).toHaveLength(0);
     |                         ^ Error: expect(received).toHaveLength(expected)
  42 | });
  43 | 
  44 | test('check specific accessibility rules only', async ({ page }) => {
  45 |   await page.goto('https://www.saucedemo.com');
  46 | 
  47 |   const accessibilityResults = await new AxeBuilder({ page })
  48 |     .withRules(['color-contrast', 'label', 'button-name'])
  49 |     .analyze();
  50 | 
  51 |   console.log('Violations found:', accessibilityResults.violations.length);
  52 | 
  53 |   for (const violation of accessibilityResults.violations) {
  54 |     console.log(`- ${violation.id}: ${violation.description}`);
  55 |   }
  56 | 
  57 |   expect(accessibilityResults.violations).toHaveLength(0);
  58 | });
```