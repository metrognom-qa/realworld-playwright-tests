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
  // Go to profile and open My Articles
  await profilePage.open('Emily Parker');
  await profilePage.myArticlesTab.click();

  // Verify the article is not liked yet
  const myArticlePreview = await profilePage.findArticlePreview(publishedArticle.title);
  await expect(myArticlePreview.favoriteButton).not.toHaveClass(/\bactive\b/);
  await expect(myArticlePreview.favoriteButton).toHaveText(/\(\s*0\s*\)/);

  // Like the article and wait until the like is saved
  await myArticlePreview.favorite();
  await expect(myArticlePreview.favoriteButton).toHaveClass(/\bactive\b/);
  await expect(myArticlePreview.favoriteButton).toHaveText(/\(\s*1\s*\)/);

  // Switch to the Favorited Articles tab
  await profilePage.openFavoritedArticles();
  await expect(page).toHaveURL(/\/favorites$/);

  // Verify the article is listed in Favorited Articles and is still liked
  const favoritedArticlePreview = await profilePage.findArticlePreview(publishedArticle.title);
  await expect(favoritedArticlePreview.title).toHaveText(publishedArticle.title);
  await expect(favoritedArticlePreview.favoriteButton).toHaveClass(/\bactive\b/);
  await expect(favoritedArticlePreview.favoriteButton).toHaveText(/\(\s*1\s*\)/);
});
