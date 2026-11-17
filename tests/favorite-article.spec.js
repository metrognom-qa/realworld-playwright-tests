// Like an article in My Articles and verify the like in Favorited Articles.
// Precondition (publishedArticle fixture): logged in, a new article is created, so it starts with 0 likes.
// 1. Open My Articles in the profile and verify the article is not liked (counter 0).
// 2. Like the article and verify the button becomes active and the counter shows 1.
// 3. Switch to the Favorited Articles tab.
// 4. Verify the article appears there with the exact title, still liked, with counter 1.

import { test, expect } from '../fixtures';

test('Like article in My Articles and verify it in Favorited Articles', async ({
  page,
  publishedArticle,
  profilePage,
}) => {
  await profilePage.open(process.env.TEST_USERNAME);
  await profilePage.openMyArticles();

  const myArticlePreview = await profilePage.findArticlePreview(publishedArticle.title);
  await expect(myArticlePreview.favoriteButton).not.toHaveClass(/\bactive\b/);
  await expect(myArticlePreview.favoriteButton).toHaveText(/\(\s*0\s*\)/);

  await myArticlePreview.favorite();
  await expect(myArticlePreview.favoriteButton).toHaveClass(/\bactive\b/);
  await expect(myArticlePreview.favoriteButton).toHaveText(/\(\s*1\s*\)/);

  await profilePage.openFavoritedArticles();
  await expect(page).toHaveURL(/\/favorites$/);

  const favoritedArticlePreview = await profilePage.findArticlePreview(publishedArticle.title);
  await expect(favoritedArticlePreview.title).toHaveText(publishedArticle.title);
  await expect(favoritedArticlePreview.favoriteButton).toHaveClass(/\bactive\b/);
  await expect(favoritedArticlePreview.favoriteButton).toHaveText(/\(\s*1\s*\)/);
});
