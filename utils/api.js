// Small API helpers for test data cleanup.

// Slug is the article's id in the URL: https://realworld.qa.guru/#/article/<slug>
export function getArticleSlugFromUrl(page) {
  return decodeURIComponent(page.url().split('#/article/')[1]);
}

// Deletes an article through the API as the logged-in user.
// The site keeps the auth header in localStorage under "loggedUser".
export async function deleteArticle(page, slug) {
  const { headers } = await page.evaluate(() => JSON.parse(localStorage.getItem('loggedUser')));
  const response = await page.request.delete(`/api/articles/${slug}`, { headers });
  if (!response.ok()) {
    throw new Error(`Failed to delete article "${slug}": HTTP ${response.status()}`);
  }
}
