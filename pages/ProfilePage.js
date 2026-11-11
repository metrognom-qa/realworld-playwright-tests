export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.myArticlesTab = page.getByRole('link', { name: 'My Articles' });
  }

  async open(username) {
  await this.page.getByRole('link', {
    name: username,
    exact: true,
  }).first().click();
}

  async getArticleByTitle(title) {
    return this.page.getByRole('link', { name: title });
  }
}
