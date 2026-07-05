import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('topbar shows greeting', async ({ page }) => {
    await expect(page.locator('.topbar-title')).toContainText(/good (morning|afternoon|evening)/i);
  });

  test('shows four stat cards', async ({ page }) => {
    await expect(page.locator('.stat-card')).toHaveCount(4);
  });

  test('Connected Agents card shows 4', async ({ page }) => {
    const card = page.locator('.stat-card').filter({ hasText: 'Connected Agents' });
    await expect(card.locator('.stat-value')).toHaveText('4');
  });

  test('Pending Reviews card is visible', async ({ page }) => {
    await expect(page.locator('.stat-card').filter({ hasText: 'Pending Reviews' })).toBeVisible();
  });

  test('Events by Type chart is rendered', async ({ page }) => {
    await expect(page.locator('.card-title').filter({ hasText: 'Events by Type' })).toBeVisible();
    // Recharts renders an SVG
    await expect(page.locator('.dashboard-charts svg').first()).toBeVisible();
  });

  test('Tasks by Status chart is rendered', async ({ page }) => {
    await expect(page.locator('.card-title').filter({ hasText: 'Tasks by Status' })).toBeVisible();
  });

  test('Recent Activity feed has log entries', async ({ page }) => {
    await expect(page.locator('.card-title').filter({ hasText: 'Recent Activity' })).toBeVisible();
    await expect(page.locator('.log-list')).toBeVisible();
    // Seeded activity logs should produce at least one entry
    const items = page.locator('.log-list').locator('> *');
    await expect(items.first()).toBeVisible();
  });

  test('Simulate Event button navigates to /event-simulator', async ({ page }) => {
    await page.getByRole('button', { name: /simulate event/i }).click();
    await expect(page).toHaveURL(/\/event-simulator/);
  });

  test('View all link on Recent Activity navigates to /activity-logs', async ({ page }) => {
    await page.getByRole('button', { name: 'View all →' }).click();
    await expect(page).toHaveURL(/\/activity-logs/);
  });
});
