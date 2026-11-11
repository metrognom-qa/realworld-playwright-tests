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
    await this.globalFeedButton.click();
  }

  getArticleByTitle(title) {
    return this.page.getByRole('heading', {
      name: title,
      exact: true,
    });
  }

  async openArticle(title) {
    await this.page.getByRole('link')
      .filter({ has: this.getArticleByTitle(title) })
      .click();
  }
}