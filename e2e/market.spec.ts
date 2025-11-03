import { test, expect } from '@playwright/test';

const FILTER_STATUS = 'active';

test.describe('Market Page E2E Flow (Zombie Row Test)', () => {
  test('should handle filter, trade, flash, and "zombie row" logic', async ({
    page,
  }) => {
    // --- 1. NAVIGATION & INITIAL LOAD ---
    // Navigate to the root page (defined as 'baseURL' in playwright.config.ts)
    await page.goto('/');

    // Wait for the table to be populated by the WebSocket 'offers:init' event.
    // We do this by waiting for the first <tr> in the <tbody> to become visible.
    // We give it a 10-second timeout in case the socket is slow.
    await expect(page.locator('tbody tr').first()).toBeVisible({
      timeout: 10000,
    });

    // --- 2. APPLY FILTER ---
    // Find the <select> element by its accessible label.
    const statusFilter = page.getByLabel('Filter by Status:');

    // Select the 'active' option.
    await statusFilter.selectOption(FILTER_STATUS);

    // Verify that our 'useMarketFilters' hook correctly updated the URL.
    await expect(page).toHaveURL(`/?status=${FILTER_STATUS}`);

    // --- 3. TARGET & ACTION ---
    // We grab the id of the first row
    // that is visible after the "active" filter has been applied.
    const firstRow = page.locator('tbody tr').first();

    // Get the id of the first row.
    const firstRowId = await firstRow.getAttribute('data-testid');

    // Assert that the first row id is not null.
    expect(firstRowId).toBeTruthy();

    // Get the target row by its id.
    const targetRow = page.getByTestId(firstRowId!);

    // Verify that the first row is visible.
    await expect(targetRow).toBeVisible();

    // Ensure that at least one 'active' row exists to continue the test.
    await expect(targetRow).toBeVisible();

    // Find the "Trade" button within that specific row.
    const tradeButton = targetRow.getByRole('button', { name: 'Trade' });

    // Assert that the button is enabled before we click it.
    await expect(tradeButton).not.toBeDisabled();

    // Perform the user action.
    await tradeButton.click();

    // --- 4. VERIFICATION OF "ZOMBIE ROW" LOGIC ---
    // A. The Flash:
    //    We assert that the <tr> element now has the 'flashCompleted' class.
    //    We use a regex (/.../i) to match the class name generated
    //    by CSS Modules (e.g., 'TableRow_flashCompleted__abc12').
    await expect(targetRow).toHaveClass(/flashCompleted/i);

    // B. The Button (Disabled):
    //    Assert that the button is now disabled.
    await expect(tradeButton).toBeDisabled();

    // C. The "Zombie Row" Logic:
    //    Even though the filter is 'active' and the
    //    row's status is now 'completed', it must remain visible
    //    thanks to the 'justCompletedId' logic in 'useFilteredOffers'.
    await expect(targetRow).toBeVisible();

    // --- 5. DELETING THE "ZOMBIE ROW" ---
    // Wait for 1.5 seconds, which is longer than the 1.2s
    // 'setTimeout' in MarketPage that clears the 'justCompletedId'.
    await page.waitForTimeout(1500);

    // Now that the 'justCompletedId' is null, the filter should
    // re-run, and the "completed" row should finally disappear.
    await expect(targetRow).not.toBeVisible();
  });
});
