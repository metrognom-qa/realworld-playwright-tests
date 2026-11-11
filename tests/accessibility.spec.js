// Accessibility checks of the key pages against WCAG 2.2 levels A and AA (axe-core).
// Each check is soft: the test runs to the end, all violations are listed in the report
// ("Accessibility: <page>" attachment with a readable description, plus full JSON),
// and the test is marked failed if any violations were found.

import { test, expect } from '../fixtures';
import { loadArticlesList } from '../pages/ArticlePreview';

const BASE_URL = 'https://realworld.qa.guru/';

// Tagged @a11y so these checks can be run separately from the functional tests
test.describe('Accessibility (WCAG 2.2 AA)', { tag: '@a11y' }, () => {
  test('Home page (logged out)', async ({ page, checkAccessibility }) => {
    await loadArticlesList(page, () => page.goto(BASE_URL));
    await checkAccessibility('Home page');
  });

  test('Login page', async ({ loginPage, checkAccessibility }) => {
    await loginPage.open();
    await expect(loginPage.emailInput).toBeVisible();
    await checkAccessibility('Login page');
  });

  test('New Article editor', async ({ loginPage, newArticlePage, checkAccessibility }) => {
    await loginPage.open();
    await loginPage.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
    await newArticlePage.open();
    await expect(newArticlePage.publishButton).toBeVisible();
    await checkAccessibility('New Article editor');
  });

  test('Article page with a comment', async ({
    publishedArticle,
    articleDetailsPage,
    checkAccessibility,
  }) => {
    // Add a comment so the comment card (author, date, delete button) is checked too
    const commentText = 'Accessibility check comment';
    await articleDetailsPage.addComment(commentText);
    await expect(articleDetailsPage.getComment(commentText).text).toHaveText(commentText);
    await expect(articleDetailsPage.title).toHaveText(publishedArticle.title);
    await checkAccessibility('Article page');
  });

  test('Profile page (My Articles)', async ({
    publishedArticle,
    profilePage,
    checkAccessibility,
  }) => {
    await profilePage.open(process.env.TEST_USERNAME);
    await expect(profilePage.myArticlesTab).toBeVisible();
    await checkAccessibility('Profile page');
  });
});
