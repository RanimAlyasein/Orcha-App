import { test, expect } from '@playwright/test';

test.describe('Customers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customers');
    await page.waitForLoadState('networkidle');
  });

  test('page title is Customers', async ({ page }) => {
    await expect(page.locator('.topbar-title')).toHaveText('Customers');
  });

  test('shows seeded patients', async ({ page }) => {
    // Scope to tbody — each name appears in a <div> inside a <td>,
    // and getByText would otherwise match the parent <tr> too (strict violation)
    const tbody = page.locator('table tbody');
    await expect(tbody.getByText('Layla Al-Mansouri').first()).toBeVisible();
    await expect(tbody.getByText('Omar Khalid').first()).toBeVisible();
    await expect(tbody.getByText('Fatima Hassan').first()).toBeVisible();
    await expect(tbody.getByText('Ahmed Al-Zahra').first()).toBeVisible();
  });

  test('subtitle shows customer count', async ({ page }) => {
    await expect(page.locator('.topbar-sub')).toContainText('customers tracked');
  });

  test('Add Customer button opens modal', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Customer' }).click();
    await expect(page.locator('.modal')).toBeVisible();
  });

  test('Add Customer modal closes on Cancel', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Customer' }).click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('clicking a customer row navigates to detail page', async ({ page }) => {
    // Click the row that contains the customer name
    await page.locator('tbody tr').filter({ hasText: 'Layla Al-Mansouri' }).first().click();
    await page.waitForURL(/\/customers\/.+/);
    await expect(page).toHaveURL(/\/customers\/.+/);
  });
});
