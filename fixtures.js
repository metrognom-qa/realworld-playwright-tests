// Custom fixtures: things tests receive ready-made instead of creating them in every test.
// Usage in a test file:
//   import { test, expect } from '../fixtures';
//   test('...', async ({ publishedArticle, articleDetailsPage }) => { ... });

import { test as base, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from './pages/LoginPage';
import { NewArticlePage } from './pages/NewArticlePage';
import { ProfilePage } from './pages/ProfilePage';
import { HomePage } from './pages/HomePage';
import { ArticleDetailsPage } from './pages/ArticleDetailsPage';
import { API_URL, deleteArticle, getArticleSlugFromUrl } from './utils/api';
import {
  scanAccessibility,
  formatViolationSummary,
  formatViolationDetails,
  formatViolationsReport,
} from './utils/accessibility';

// Error for accessibility violations that shows only the violation lines in the report
// (no stack trace, no code snippet). Each line starts with "Error: ".
function violationsError(violations) {
  const lines = violations.map((violation) => `${formatViolationSummary(violation)}.`);
  const error = new Error(lines.join('\nError: '));
  error.stack = lines.map((line) => `Error: ${line}`).join('\n');
  return error;
}

export const test = base.extend({
  // Page objects: created for each test that asks for them
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  newArticlePage: async ({ page }, use) => {
    await use(new NewArticlePage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  articleDetailsPage: async ({ page }, use) => {
    await use(new ArticleDetailsPage(page));
  },

  // Accessibility check of the current page (WCAG 2.2 A/AA), soft:
  // the test runs to the end and is marked failed afterwards if any violations were found.
  // In the report, every violation is a separate failed step whose error is one line, e.g.
  //   "[serious] WCAG 1.4.3 color-contrast: Elements must meet ... — 78 element(s)."
  // with a "Details" attachment (why it matters, elements, how to fix).
  //   await checkAccessibility('Login page');
  checkAccessibility: async ({ page }, use, testInfo) => {
    const allViolations = [];

    await use(async (pageName) => {
      // Errors are caught so the test continues; the steps are still shown as failed
      await base.step(`Accessibility check: ${pageName} (WCAG 2.2 A/AA)`, async () => {
        // Grouped in its own step so axe-core's internal browser calls do not clutter the report
        const violations = await base.step('Scan the page with axe-core', () =>
          scanAccessibility(page),
        );

        // Whole-page report: readable text + full axe-core JSON
        await testInfo.attach(`Accessibility report: ${pageName}`, {
          body: formatViolationsReport(pageName, page.url(), violations),
          contentType: 'text/plain',
        });
        await testInfo.attach(`Accessibility report (JSON): ${pageName}`, {
          body: JSON.stringify(violations, null, 2),
          contentType: 'application/json',
        });

        if (violations.length === 0) {
          await base.step('No violations found', async () => {});
          return;
        }

        // One failed step per violation
        for (const violation of violations) {
          allViolations.push(violation);
          await base
            .step(formatViolationSummary(violation), async () => {
              await testInfo.attach('Details', {
                body: formatViolationDetails(violation),
                contentType: 'text/plain',
              });
              throw violationsError([violation]);
            })
            .catch(() => {});
        }

        // Mark the whole page check as failed too
        throw violationsError(violations);
      }).catch(() => {});
    });

    // After the test body has finished: mark the test failed with one line per violation
    if (allViolations.length > 0) {
      throw violationsError(allViolations);
    }
  },

  // Precondition for tests that need an existing article:
  // logs in, creates a new article with Faker data, and leaves the browser on its page.
  // After the test (even a failed one), deletes this article so test data does not pile up.
  publishedArticle: async ({ page, loginPage, newArticlePage, articleDetailsPage }, use) => {
    // ---- Before the test ----
    const article = {
      title: `Test article ${faker.string.uuid()}`,
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tag: faker.word.noun(),
    };

    await loginPage.open();
    await loginPage.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
    await newArticlePage.open();
    await newArticlePage.fillAndPublish(article);
    await expect(articleDetailsPage.title).toHaveText(article.title);
    article.slug = getArticleSlugFromUrl(page);

    // Editing the title changes the article's slug (its id in the URL); keep it up to date
    page.on('response', async (response) => {
      if (
        response.request().method() === 'PUT' &&
        response.url().startsWith(`${API_URL}/articles/`) &&
        response.ok()
      ) {
        article.slug = (await response.json()).article.slug;
      }
    });

    // ---- The test runs here ----
    await use(article);

    // ---- After the test: delete only the article created above ----
    await deleteArticle(page, article.slug);
  },
});


export { expect };
