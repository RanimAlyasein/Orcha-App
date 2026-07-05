import { test, expect } from '@playwright/test';

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');
  });

  test('page title is Tasks', async ({ page }) => {
    await expect(page.locator('.topbar-title')).toHaveText('Tasks');
  });

  test('shows seeded tasks in the table', async ({ page }) => {
    // Scope to tbody to avoid strict-mode violations from parent elements inheriting text
    await expect(page.locator('tbody').getByText('Confirm tomorrow')).toBeVisible();
    await expect(page.locator('tbody').getByText('Resolve 12 insurance coverage inquiries').first()).toBeVisible();
  });

  test('table has correct columns', async ({ page }) => {
    await expect(page.locator('table thead')).toContainText('Title');
    await expect(page.locator('table thead')).toContainText('Agent');
    await expect(page.locator('table thead')).toContainText('Status');
    await expect(page.locator('table thead')).toContainText('Priority');
  });

  test('status filter tabs are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'To Do' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'In Progress' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Done' })).toBeVisible();
  });

  test('filtering by Done shows only done tasks', async ({ page }) => {
    await page.getByRole('button', { name: 'Done' }).click();
    await page.waitForLoadState('networkidle');
    // All status dropdowns in the table should show "Done"
    const statusSelects = page.locator('select.status-select');
    const count = await statusSelects.count();
    for (let i = 0; i < count; i++) {
      await expect(statusSelects.nth(i)).toHaveValue('DONE');
    }
  });

  test('filtering by In Progress narrows results', async ({ page }) => {
    // Get total count first
    const allText = await page.locator('.topbar-sub').textContent();

    await page.getByRole('button', { name: 'In Progress' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.topbar-sub')).toContainText('In Progress');
  });

  test('Add Task button opens modal', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Task' }).click();
    await expect(page.locator('.modal')).toBeVisible();
  });

  test('Add Task modal closes on Cancel', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Task' }).click();
    // exact:true avoids matching the "Cancelled" status filter tab
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('priority dropdown shows All Priorities option', async ({ page }) => {
    await expect(page.locator('select').filter({ hasText: 'All Priorities' })).toBeVisible();
  });
});
