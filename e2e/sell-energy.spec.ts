import { test, expect } from '@playwright/test';

const COMMON_FIELD_KEY = 'price';
const SOLAR_FIELD_KEY = 'location';
const GAS_FIELD_KEY = 'deliveryMethod';

// --------------------------------------------------------

test.describe('Sell Energy Page (Dynamic Form)', () => {
  test('should dynamically render fields based on selection', async ({
    page,
  }) => {
    // --- 1. NAVIGATION & INITIAL LOAD ---
    // 1. Navigate to the page
    await page.goto('/sell');

    // 2. Find the main <select> by its id (which is referenced by the label's htmlFor)
    const typeSelector = page.locator('#energyType');
    await expect(typeSelector).toBeVisible();

    // 3. --- VERIFY SOLAR STATE ---
    // We select 'solar'
    await typeSelector.selectOption('solar');

    // Find the dynamic fields by their 'data-testid={key}'
    const solarField = page.getByTestId(SOLAR_FIELD_KEY);
    const gasField = page.getByTestId(GAS_FIELD_KEY);

    // Check that the solar-specific field is visible
    await expect(solarField).toBeVisible();

    // Check that the gas-specific field is hidden
    await expect(gasField).toBeHidden();

    // --- 4. ACTION (CHANGE TYPE) ---
    // The user selects 'gas'
    await typeSelector.selectOption('gas');

    // --- 5. VERIFY GAS STATE ---
    // The solar field should now be hidden
    await expect(solarField).toBeHidden();

    // The gas field should now be visible
    await expect(gasField).toBeVisible();

    // Check that a common field (like price) is still visible
    const commonField = page.getByTestId(COMMON_FIELD_KEY);
    await expect(commonField).toBeVisible();
  });
});
