import { ArticlePreview, findArticlePreview, loadArticlesList } from './ArticlePreview';

export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.myArticlesTab = page.getByRole('link', { name: 'My Articles' });
    this.favoritedArticlesTab = page.getByRole('link', { name: 'Favorited Articles' });
  }

  // Open the profile by clicking the author's name link (e.g. on an article page)
  async open(username) {
    await loadArticlesList(this.page, () =>
      this.page.getByRole('link', { name: username, exact: true }).first().click(),
    );
  }

  // Open the current user's profile through the navigation menu
  async openFromNavigation(username) {
    await this.page.getByRole('navigation').getByText(username, { exact: true }).click();
    await loadArticlesList(this.page, () =>
      this.page.getByRole('link', { name: /Profile/ }).click(),
    );
  }

  async openFavoritedArticles() {
    await loadArticlesList(this.page, () => this.favoritedArticlesTab.click());
  }

  getArticlePreview(title) {
    return new ArticlePreview(this.page, title);
  }

  // Searches all pages of the current tab
  async findArticlePreview(title) {
    return findArticlePreview(this.page, title);
  }

  // Searches all pages of the current tab and returns the article link
  async getArticleByTitle(title) {
    const preview = await this.findArticlePreview(title);
    return preview.root.getByRole('link', { name: title });
  }
}
