export class ArticleDetailsPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('heading', { level: 1 });
  }

  getBodyByText(body) {
    return this.page.getByText(body, { exact: true });
  }

  getTagByName(tag) {
    return this.page.getByText(tag, { exact: true });
  }
}