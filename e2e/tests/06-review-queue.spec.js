import { test, expect } from '@playwright/test';

test.describe('Review Queue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/review-queue');
    await page.waitForLoadState('networkidle');
  });

  test('page title is Review Queue', async ({ page }) => {
    await expect(page.locator('.topbar-title')).toHaveText('Review Queue');
  });

  test('filter tabs are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pending' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Approved' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rejected' })).toBeVisible();
  });

  test('pending review items exist', async ({ page }) => {
    // There may be many pending items from live app usage; check at least one exists
    await expect(page.locator('.rq-card--pending').first()).toBeVisible();
  });

  test('pending item contains agent output text', async ({ page }) => {
    // The seeded item comes from the Follow-Up Call Agent; live usage may add more
    const firstCard = page.locator('.rq-card--pending').first();
    await expect(firstCard).toBeVisible();
    // Each card shows original output — just verify the card has non-empty content
    await expect(firstCard.locator('.rq-output, [class*="output"], p').first()).not.toBeEmpty();
  });

  test('Pending filter shows only pending items', async ({ page }) => {
    await page.getByRole('button', { name: 'Pending' }).click();
    await page.waitForLoadState('networkidle');
    const cards = page.locator('.rq-card');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveClass(/rq-card--pending/);
    }
  });

  test('Approve button is visible on first pending item', async ({ page }) => {
    const firstCard = page.locator('.rq-card--pending').first();
    await expect(firstCard.getByRole('button', { name: /approve/i }).first()).toBeVisible();
  });

  test('Reject button is visible on first pending item', async ({ page }) => {
    const firstCard = page.locator('.rq-card--pending').first();
    await expect(firstCard.getByRole('button', { name: /reject/i }).first()).toBeVisible();
  });
});
