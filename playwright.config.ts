import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',

  timeout: 30 * 1000,

  fullyParallel: true,

  retries: process.env.CI ? 0 : 1,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: baseURL,

    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev:e2e',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
