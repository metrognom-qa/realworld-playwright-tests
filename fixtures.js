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
import { deleteArticle, getArticleSlugFromUrl } from './utils/api';

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

  articlesToDelete: async ({ page }, use) => {
    const slugs = [];
    await use(slugs);
    for (const slug of slugs) {
      await deleteArticle(page, slug);
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
        response.url().includes('/api/articles/') &&
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
