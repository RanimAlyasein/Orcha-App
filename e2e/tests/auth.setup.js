import { test as setup } from '@playwright/test';

const AUTH_DIR = 'playwright/.auth';

setup('save manager auth state', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('you@company.com').fill('manager@orcha.demo');
  await page.getByPlaceholder('••••••••').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: `${AUTH_DIR}/manager.json` });
});

setup('save admin auth state', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('you@company.com').fill('admin@orcha.demo');
  await page.getByPlaceholder('••••••••').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/admin');
  await page.context().storageState({ path: `${AUTH_DIR}/admin.json` });
});
