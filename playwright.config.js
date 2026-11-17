// @ts-check
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

/* Test account settings from .env */
const missingEnv = ['TEST_EMAIL', 'TEST_PASSWORD', 'TEST_USERNAME'].filter(
  (name) => !process.env[name],
);
if (missingEnv.length > 0) {
  throw new Error(`Missing in .env: ${missingEnv.join(', ')}.`);
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* 4 tests at a time. Safe with one shared test account: tests search all pages
     of article lists and wait for fresh list data (see pages/ArticlePreview.js). */
  workers: 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'https://realworld.qa.guru',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});

