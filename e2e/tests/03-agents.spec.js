import { test, expect } from '@playwright/test';

test.describe('Agents', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');
  });

  test('page title is Agents', async ({ page }) => {
    await expect(page.locator('.topbar-title')).toHaveText('Agents');
  });

  test('shows all four seeded agents', async ({ page }) => {
    const grid = page.locator('.agent-grid');
    await expect(grid.getByText('Appointment Assistant')).toBeVisible();
    await expect(grid.getByText('Patient Support Bot')).toBeVisible();
    await expect(grid.getByText('Follow-Up Call Agent')).toBeVisible();
    await expect(grid.getByText('Prescription Reminder Bot')).toBeVisible();
  });

  test('subtitle says agents connected', async ({ page }) => {
    // Number can vary if extra agents were added; just confirm the label is present
    await expect(page.locator('.topbar-sub')).toContainText('agents connected');
  });

  test('each agent card shows channel label', async ({ page }) => {
    const grid = page.locator('.agent-grid');
    // Use .first() — live app may have extra agents with duplicate channel names
    await expect(grid.getByText('WhatsApp').first()).toBeVisible();
    await expect(grid.getByText('Website Chat').first()).toBeVisible();
    await expect(grid.getByText('Voice').first()).toBeVisible();
  });

  test('clicking an agent navigates to its detail page', async ({ page }) => {
    await page.locator('.agent-card').filter({ hasText: 'Appointment Assistant' }).click();
    await page.waitForURL(/\/agents\/.+/);
    await expect(page).toHaveURL(/\/agents\/.+/);
    // Detail page shows the name in the topbar
    await expect(page.locator('.topbar-title')).toHaveText('Appointment Assistant');
  });

  test('Connect Agent button opens modal', async ({ page }) => {
    await page.getByRole('button', { name: '+ Connect Agent' }).click();
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal-title')).toHaveText('Connect Agent');
  });

  test('Connect Agent modal closes on Cancel', async ({ page }) => {
    await page.getByRole('button', { name: '+ Connect Agent' }).click();
    await expect(page.locator('.modal')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('Connect Agent modal closes on ✕ button', async ({ page }) => {
    await page.getByRole('button', { name: '+ Connect Agent' }).click();
    await expect(page.locator('.modal')).toBeVisible();
    await page.locator('.icon-btn[aria-label="Close"]').click();
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('Connect Agent form shows error for whitespace-only name', async ({ page }) => {
    await page.getByRole('button', { name: '+ Connect Agent' }).click();
    // Fill with spaces — bypasses browser required validation but fails React's trim() check
    await page.locator('.modal').getByPlaceholder('Sara Sales Bot').fill('   ');
    await page.getByRole('button', { name: 'Connect Agent', exact: true }).click();
    await expect(page.locator('.form-error')).toBeVisible();
  });
});
