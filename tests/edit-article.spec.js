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
  newArticlePage,
}) => {

  await profilePage.open(process.env.TEST_USERNAME);
  await profilePage.openMyArticles();
  await profilePage.openArticle(article.title);
  await expect(articleDetailsPage.title).toHaveText(article.title);

const editedArticle = {
  title: `${article.title} - Edited`,
  body: `${article.body} - Edited`,
};

await articleDetailsPage.openEditor();
await newArticlePage.editArticle(editedArticle);

await expect(articleDetailsPage.title).toHaveText(editedArticle.title);

await profilePage.openFromNavigation(process.env.TEST_USERNAME);

await profilePage.openMyArticles();

await profilePage.openArticle(editedArticle.title);

// Verify the correct article opened before reloading
await expect(articleDetailsPage.title).toHaveText(editedArticle.title);

await page.reload();

await expect(articleDetailsPage.title).toHaveText(editedArticle.title);

await expect(
  articleDetailsPage.getBodyByText(editedArticle.body)
).toBeVisible();
});
