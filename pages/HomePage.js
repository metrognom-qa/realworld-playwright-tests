import { expect } from '@playwright/test';
import { ArticlesList } from './ArticlePreview';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.articlesList = new ArticlesList(page);
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.globalFeedButton = page.getByRole('button', {
      name: 'Global Feed',
    });
    this.noArticlesMessage = page.getByText('Articles not available.');
  }

  // For a logged-in user the home page first loads "Your Feed".
  // Wait until it is loaded and shown; otherwise its late response can replace
  // the Global Feed list that the test opens right after.
  async open() {
    await Promise.all([
      this.page.waitForResponse((res) => res.url().includes('/api/articles/feed?')),
      this.homeLink.click(),
    ]);
    await expect(this.noArticlesMessage.or(this.articlesList.firstArticleTitle)).toBeVisible();
  }

  async openGlobalFeed() {
    await this.articlesList.load(() => this.globalFeedButton.click());
  }

  getArticleByTitle(title) {
    return this.page.getByRole('heading', {
      name: title,
      exact: true,
    });
  }

  // Searches all pages of the current feed
  async findArticlePreview(title) {
    return this.articlesList.find(title);
  }

  async openArticle(title) {
    await this.page.getByRole('link')
      .filter({ has: this.getArticleByTitle(title) })
      .click();
  }
}