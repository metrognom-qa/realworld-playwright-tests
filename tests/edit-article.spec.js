// Edit an article (title and body) and verify that the changes persist.
// Precondition (publishedArticle fixture): logged in, a new article is created with Faker data.
// 1. Open My Articles in the profile and verify the created article appears by title.
// 2. Open the article, enter the editor, append " - Edited" to the title and body, and save.
// 3. Verify the updated title is displayed on the article page.
// 4. Return to My Articles via the navigation menu and verify the article appears with its updated title.
// 5. Open the updated article, reload the page, and verify the edited title and body are preserved.

import { test, expect } from '../fixtures';

test('Edit article title and body and verify the changes persist', async ({
  page,
  publishedArticle: article,
  profilePage,
  articleDetailsPage,
}) => {

  // Go to profile and find article is in My Articles
  await profilePage.open('Emily Parker');
  await profilePage.myArticlesTab.click();
  const createdArticleLink = await profilePage.getArticleByTitle(article.title);
  await expect(createdArticleLink).toBeVisible();

  // Open the created article
  await createdArticleLink.click();
  await expect(articleDetailsPage.title).toHaveText(article.title);

  // Prepare updated values based on the created article
const editedArticle = {
  title: `${article.title} - Edited`,
  body: `${article.body} - Edited`,
};

// Open the article editor
await page
  .getByRole('link', { name: /Edit Article/ })
  .nth(1)
  .click();

  // Update the title and body
await page
  .getByRole('textbox', { name: 'Article Title', exact: true })
  .fill(editedArticle.title);

await page
  .getByRole('textbox', { name: 'Write your article (in' })
  .fill(editedArticle.body);
  // Save changes
await page
  .getByRole('button', { name: 'Update Article', exact: true })
  .click();

// Wait until the updated article is displayed
await expect(articleDetailsPage.title).toHaveText(editedArticle.title);

// Open the current user's profile through the navigation menu
await profilePage.openFromNavigation('Emily Parker');

await profilePage.myArticlesTab.click();

// Find and open the article using its updated title
const editedArticleLink = await profilePage.getArticleByTitle(
  editedArticle.title
);

await expect(editedArticleLink).toBeVisible();
await editedArticleLink.click();

// Verify the correct article opened before reloading
await expect(articleDetailsPage.title).toHaveText(editedArticle.title);

// Reload to verify that the edited values persist
await page.reload();

await expect(articleDetailsPage.title).toHaveText(editedArticle.title);

await expect(
  articleDetailsPage.getBodyByText(editedArticle.body)
).toBeVisible();
});
