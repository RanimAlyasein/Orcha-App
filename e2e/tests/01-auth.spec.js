import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('wrong password is rejected and stays on /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@company.com').fill('manager@orcha.demo');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Wait for the API round-trip to complete (button leaves "Signing in..." state)
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible({ timeout: 30_000 });
    // Login failed — we must still be on /login, not redirected to /dashboard
    await expect(page).toHaveURL(/\/login/);
  });

  test('manager login redirects to /dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@company.com').fill('manager@orcha.demo');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('admin login redirects to /admin', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@company.com').fill('admin@orcha.demo');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('**/admin');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('logout redirects to /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@company.com').fill('manager@orcha.demo');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('**/dashboard');

    await page.locator('.sidebar-logout').click();
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
  });

  test('unauthenticated /dashboard access redirects away', async ({ page }) => {
    await page.goto('/dashboard');
    // App should redirect to login or landing when no token
    await expect(page).not.toHaveURL(/\/dashboard/);
  });
});
