import { expect } from '@playwright/test';

// Article preview card shown in article lists (Global Feed, My Articles, Favorited Articles).
// Each field is located inside the card, so assertions match one field exactly.
export class ArticlePreview {
  constructor(page, title) {
    this.root = page
      .locator('.article-preview')
      .filter({ has: page.getByRole('heading', { name: title, exact: true }) });
    this.title = this.root.getByRole('heading');
    this.description = this.root.getByRole('paragraph');
    this.tags = this.root.getByRole('listitem');
    this.favoriteButton = this.root.getByRole('button');
  }

  async favorite() {
    await this.favoriteButton.click();
  }
}

function firstArticleTitle(page) {
  return page.locator('.article-preview').getByRole('heading').first();
}

// Run an action that loads an article list (open a profile, tab, feed, or next page),
// wait for the list API response, and wait until the page shows that fresh response.
// Without this, the test can read the previous (stale) list that is still on screen.
export async function loadArticlesList(page, action) {
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.request().method() === 'GET' && res.url().includes('/api/articles?'),
    ),
    action(),
  ]);
  const { articles } = await response.json();
  if (articles.length > 0) {
    await expect(firstArticleTitle(page)).toHaveText(articles[0].title);
  }
}

// Find an article preview in the current list, moving through pagination pages
// until the article is found. Throws if the article is not on any page.
export async function findArticlePreview(page, title) {
  const preview = new ArticlePreview(page, title);
  const pagination = page.getByRole('navigation', { name: 'Pagination' });
  const nextPageButton = pagination.getByRole('button', { name: 'Next page' });

  for (let pageNumber = 1; ; pageNumber++) {
    await firstArticleTitle(page).waitFor();

    if (await preview.root.isVisible()) {
      return preview;
    }

    const hasNextPage =
      (await nextPageButton.isVisible()) && (await nextPageButton.isEnabled());
    if (!hasNextPage) {
      throw new Error(`Article "${title}" was not found on any of ${pageNumber} page(s)`);
    }

    await loadArticlesList(page, () => nextPageButton.click());
  }
}
