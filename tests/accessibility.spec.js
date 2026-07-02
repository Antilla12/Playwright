import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// list of known violations we accept because saucedemo is a demo site
const knownViolations = [
  'landmark-one-main',
  'page-has-heading-one',
  'region',
  'select-name',
];

test('login page has no accessibility violations', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const accessibilityResults = await new AxeBuilder({ page }).analyze();

  // filter out known violations
  const newViolations = accessibilityResults.violations.filter(
    (v) => !knownViolations.includes(v.id)
  );

  console.log('Known violations found:', accessibilityResults.violations.length);
  console.log('New unexpected violations:', newViolations.length);

  // only fail on NEW unexpected violations
  expect(newViolations).toHaveLength(0);
});

test('inventory page has no accessibility violations', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  const accessibilityResults = await new AxeBuilder({ page }).analyze();

  const newViolations = accessibilityResults.violations.filter(
    (v) => !knownViolations.includes(v.id)
  );

  console.log('Known violations found:', accessibilityResults.violations.length);
  console.log('New unexpected violations:', newViolations.length);

  expect(newViolations).toHaveLength(0);
});

test('check specific accessibility rules only', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const accessibilityResults = await new AxeBuilder({ page })
    .withRules(['color-contrast', 'label', 'button-name'])
    .analyze();

  console.log('Violations found:', accessibilityResults.violations.length);

  for (const violation of accessibilityResults.violations) {
    console.log(`- ${violation.id}: ${violation.description}`);
  }

  expect(accessibilityResults.violations).toHaveLength(0);
});