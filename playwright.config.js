// @ts-check
import { defineConfig, devices } from '@playwright/test';
/*import { trace } from 'node:console';*/
import 'dotenv/config';

/* Test account settings from .env (see README → Setup) */
const missingEnv = ['TEST_EMAIL', 'TEST_PASSWORD', 'TEST_USERNAME'].filter(
  (name) => !process.env[name],
);
if (missingEnv.length > 0) {
  throw new Error(`Missing in .env: ${missingEnv.join(', ')}. See README → Setup.`);
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

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
  /* html — the built-in Playwright report; allure-playwright writes results to allure-results/ */
  reporter: [['html'], ['allure-playwright']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  /* Target platforms. Run one with --project, e.g. --project=windows-chrome */
  projects: [
    /* Windows: real Google Chrome installed on the machine */
    {
      name: 'windows-chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    /* Windows: Playwright's Firefox build */
    {
      name: 'windows-firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    /* Mac Safari: Playwright's WebKit (Safari's engine) with Desktop Safari settings.
       Not the real Safari app; it runs on any OS. */
    {
      name: 'mac-safari',
      use: { ...devices['Desktop Safari'] },
    },
    /* iPhone 17 Safari: emulated (WebKit, iPhone screen, touch, mobile user agent).
       iPhone 17 is the best-selling iPhone in 2026. */
    {
      name: 'iphone-17-safari',
      use: { ...devices['iPhone 17'] },
    },
    /* Android Chrome on Samsung Galaxy: emulated (Chromium, phone screen, touch, mobile user agent).
       Samsung is the leading Android brand in North America; Galaxy S24 is the newest
       Samsung device built into Playwright (Galaxy S26 Ultra is not available). */
    {
      name: 'android-galaxy-s24-chrome',
      use: { ...devices['Galaxy S24'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

