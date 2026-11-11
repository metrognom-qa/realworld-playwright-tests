import { expect } from '@playwright/test';
import { ArticlePreview, findArticlePreview, loadArticlesList } from './ArticlePreview';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.globalFeedButton = page.getByRole('button', {
      name: 'Global Feed',
    });
  }

  // For a logged-in user the home page first loads "Your Feed".
  // Wait until it is loaded and shown; otherwise its late response can replace
  // the Global Feed list that the test opens right after.
  async open() {
    await Promise.all([
      this.page.waitForResponse((res) => res.url().includes('/api/articles/feed?')),
      this.homeLink.click(),
    ]);
    await expect(
      this.page
        .getByText('Articles not available.')
        .or(this.page.locator('.article-preview').getByRole('heading').first()),
    ).toBeVisible();
  }

  async openGlobalFeed() {
    await loadArticlesList(this.page, () => this.globalFeedButton.click());
  }

  getArticleByTitle(title) {
    return this.page.getByRole('heading', {
      name: title,
      exact: true,
    });
  }

  getArticlePreview(title) {
    return new ArticlePreview(this.page, title);
  }

  // Searches all pages of the current feed
  async findArticlePreview(title) {
    return findArticlePreview(this.page, title);
  }

  async openArticle(title) {
    await this.page.getByRole('link')
      .filter({ has: this.getArticleByTitle(title) })
      .click();
  }
}