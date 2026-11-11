export class ArticleDetailsPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('heading', { level: 1 });
    this.commentInput = page.getByRole('textbox', { name: 'Write a comment...' });
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
    this.comments = page.locator('.card').filter({ has: page.locator('.card-text') });
    this.commentTexts = this.comments.getByRole('paragraph');
  }

  getBodyByText(body) {
    return this.page.getByText(body, { exact: true });
  }

  getTagByName(tag) {
    return this.page.getByText(tag, { exact: true });
  }

  async addComment(text) {
    await this.commentInput.fill(text);
    await this.postCommentButton.click();
  }

  // Comment card found by its exact text; fields are located inside the card
  getComment(text) {
    const root = this.comments.filter({
      has: this.page.getByText(text, { exact: true }),
    });
    return {
      root,
      text: root.getByRole('paragraph'),
      // The footer has two author links: the avatar (image) and the name; take the name link
      author: root.locator('.comment-author').filter({ hasNot: this.page.getByRole('img') }),
      avatar: root.getByRole('img'),
      date: root.locator('.date-posted'),
      deleteButton: root.getByRole('button'),
    };
  }

  // Deleting asks for confirmation in a browser dialog; accept it.
  // Returns the dialog message so the test can verify it.
  async deleteComment(text) {
    const dialogPromise = this.page.waitForEvent('dialog');
    const clickPromise = this.getComment(text).deleteButton.click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    await clickPromise;
    return message;
  }
}
