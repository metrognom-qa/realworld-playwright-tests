export class NewArticlePage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByRole('textbox', { name: 'Article Title' });
    this.descriptionInput = page.getByRole('textbox', { name: "What's this article about?" });
    this.bodyInput = page.getByRole('textbox', { name: 'Write your article (in' });
    this.tagsInput = page.getByRole('textbox', { name: 'Enter tags' });
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
  }

  async open() {
    await this.page.getByRole('link', { name: ' New Article' }).click();
  }

  async fillAndPublish({ title, description, body, tag }) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.bodyInput.fill(body);
    await this.tagsInput.fill(tag);
    await this.tagsInput.press('Enter');
    await this.publishButton.click();
  }
}
