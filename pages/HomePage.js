import { ArticlePreview, findArticlePreview, loadArticlesList } from './ArticlePreview';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.globalFeedButton = page.getByRole('button', {
      name: 'Global Feed',
    });
  }

  async open() {
    await this.homeLink.click();
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