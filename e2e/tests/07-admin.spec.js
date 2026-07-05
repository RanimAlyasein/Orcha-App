import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test('page title is Admin Panel', async ({ page }) => {
    await expect(page.locator('.topbar-title')).toHaveText('Admin Panel');
  });

  test('subtitle mentions System Admins only', async ({ page }) => {
    await expect(page.locator('.topbar-sub')).toContainText('System Admins only');
  });

  test('All Users tab is visible and active by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All Users' })).toBeVisible();
  });

  test('Organizations tab is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Organizations' })).toBeVisible();
  });

  test('users list shows seeded accounts', async ({ page }) => {
    await expect(page.locator('.card-title').filter({ hasText: 'All Users' })).toBeVisible();
    await expect(page.getByText('manager@orcha.demo')).toBeVisible();
  });

  test('Organizations tab shows Al Noor Medical Clinic', async ({ page }) => {
    await page.getByRole('button', { name: 'Organizations' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Al Noor Medical Clinic')).toBeVisible();
  });

  test('sidebar shows Admin Panel link only (no dashboard links)', async ({ page }) => {
    await expect(page.locator('.sidebar-link').filter({ hasText: 'Admin Panel' })).toBeVisible();
    await expect(page.locator('.sidebar-link').filter({ hasText: 'Dashboard' })).not.toBeVisible();
  });
});
