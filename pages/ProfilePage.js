import { ArticlesList } from './ArticlePreview';

export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.articlesList = new ArticlesList(page);
    this.myArticlesTab = page.getByRole('link', { name: 'My Articles' });
    this.favoritedArticlesTab = page.getByRole('link', { name: 'Favorited Articles' });
    this.navigation = page.getByRole('navigation');
    this.profileMenuLink = page.getByRole('link', { name: /Profile/ });
  }

  // Open the profile by clicking the author's name link (e.g. on an article page)
  async open(username) {
    await this.articlesList.load(() =>
      this.page.getByRole('link', { name: username, exact: true }).first().click(),
    );
  }

  // Open the current user's profile through the navigation menu
  async openFromNavigation(username) {
    await this.navigation.getByText(username, { exact: true }).click();
    await this.articlesList.load(() => this.profileMenuLink.click());
  }

  async openMyArticles() {
    await this.myArticlesTab.click();
  }

  async openFavoritedArticles() {
    await this.articlesList.load(() => this.favoritedArticlesTab.click());
  }

  // Searches all pages of the current tab
  async findArticlePreview(title) {
    return this.articlesList.find(title);
  }

  async openArticle(title) {
    const preview = await this.findArticlePreview(title);
    await preview.title.click();
  }
}
