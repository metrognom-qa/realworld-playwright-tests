## Project Structure

- `tests/` — test scenarios and assertions.
- `pages/` — page objects containing locators and actions:
  - `ArticlePreview.js` — article card in article lists (Global Feed, My Articles, Favorited Articles),
    with search across pagination pages.
- `fixtures.js` — custom fixtures: page objects, `publishedArticle` (creates and deletes a test article).
- `utils/api.js` — API helpers for test data cleanup (delete an article).
- `playwright.config.js` — Playwright configuration: browser (Chrome), reporter, `.env` check.
- `.env` — local test account credentials; excluded from Git.
