import { defineConfig, devices } from '@playwright/test';

const MANAGER_STATE = 'playwright/.auth/manager.json';
const ADMIN_STATE   = 'playwright/.auth/admin.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  globalSetup: './global-setup.js',
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://orcha-official.up.railway.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    // Saves localStorage auth tokens for manager and admin accounts
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },

    // Auth flow tests run without stored state (testing login/logout directly)
    {
      name: 'auth-flows',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /01-auth\.spec\.js/,
    },

    // All non-admin pages use manager@orcha.demo session
    {
      name: 'manager',
      use: { ...devices['Desktop Chrome'], storageState: MANAGER_STATE },
      dependencies: ['setup'],
      testIgnore: [/auth\.setup\.js/, /01-auth\.spec\.js/, /07-admin\.spec\.js/],
    },

    // Admin panel uses admin@orcha.demo session
    {
      name: 'admin',
      use: { ...devices['Desktop Chrome'], storageState: ADMIN_STATE },
      dependencies: ['setup'],
      testMatch: /07-admin\.spec\.js/,
    },
  ],
});
