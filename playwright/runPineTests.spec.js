// @ts-check
const { test, expect } = require('@playwright/test');

test('Run Pine Framework Tests', async ({ page, browser }) => {
  await page.goto('/tests/');
  await expect(page.getByText('Pine Test Framework')).toBeVisible();
  const liResults = await page.$$('#ulTestResults > li');
  const testResults = await Promise.all(liResults.map(async (li) => {
    return { text: await li.innerText(), passed: await li.evaluate(li => li.classList.contains('pass')) };
  }));

  for (const testResult of testResults) {
    await expect(testResult.passed, testResult.text).toBeTruthy();
  };

});
