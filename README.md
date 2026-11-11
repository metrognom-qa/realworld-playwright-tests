# RealWorld UI Tests

Automated UI tests for https://realworld.qa.guru/ using Playwright and JavaScript.

## Tools

- Playwright
- JavaScript
- Faker
- dotenv
- Page Object Model
- Allure Report

## Test Scenarios

All test data (article title, description, body, tag, comments) is randomized with Faker.
Tests that need an existing article get it from the `publishedArticle` fixture: it logs in,
creates a new article before the test, and deletes it through the API after the test.

### Create an article and verify it in the profile and Global Feed

`tests/create-article.spec.js`

1. Log in with the test account.
2. Create an article.
3. Verify that the article page URL contains `#/article/`.
4. Verify the article title, body, and tag after publication.
5. Open My Articles in the profile and verify the article preview: title, description, and tag.
6. Open Global Feed and verify the article preview: title, description, and tag.
7. Open the article from Global Feed and verify its title, body, and tag again.

### Edit an article

`tests/edit-article.spec.js`

1. Open My Articles in the profile and open the created article.
2. Open the editor and append " - Edited" to the title and body; save.
3. Verify the updated title on the article page.
4. Return to My Articles and verify the article appears with the updated title.
5. Open the article, reload the page, and verify the edited title and body are preserved.

### Like an article

`tests/favorite-article.spec.js`

1. Open My Articles and verify the article is not liked (counter 0).
2. Like the article and verify the button is active and the counter shows 1.
3. Switch to Favorited Articles and verify the article is there, still liked, with counter 1.

### Add a comment

`tests/add-comment.spec.js`

1. Post a comment on the article.
2. Verify the comment text, the author's avatar and name, and today's date; verify the comment input is cleared.
3. Open the article again from My Articles and verify there is exactly one comment with the same text, author, and date.

### Delete a comment

`tests/delete-comment.spec.js`

1. Post three comments and remember their display order.
2. Delete the second comment and verify the confirmation dialog text.
3. Verify the second comment is removed, and the first and third remain in the same order
   with the same text, author, and date.
4. Reload the page and verify the same result.

### Accessibility checks

`tests/accessibility.spec.js` — see [Accessibility Checks](#accessibility-checks).

## Project Structure

- `tests/` — test scenarios and assertions.
- `pages/` — page objects containing locators and actions:
  - `ArticlePreview.js` — article card in article lists (Global Feed, My Articles, Favorited Articles),
    with search across pagination pages.
- `fixtures.js` — custom fixtures: page objects, `publishedArticle` (creates and deletes a test article),
  and `checkAccessibility`.
- `utils/api.js` — API helpers for test data cleanup (delete an article).
- `utils/accessibility.js` — axe-core scan and readable accessibility report.
- `playwright.config.js` — Playwright configuration: platforms (projects), reporters, `.env` check.
- `.env` — local test account credentials; excluded from Git.

## Setup

1. Install Node.js and npm.
2. Download or clone the repository.
3. Open a terminal in the project directory.
4. Install dependencies:

   ```bash
   npm ci
   ```

5. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

6. Register a dedicated test account at https://realworld.qa.guru/.
7. Create a `.env` file in the project root, next to `package.json`.
8. Add your test account credentials:

   ```env
   TEST_EMAIL=your_test_email
   TEST_PASSWORD="your_test_password"
   TEST_USERNAME="your_username"
   ```

   Replace the placeholder values with your registered test account credentials.
   `TEST_USERNAME` is the username shown in the site header after you log in.
   Do not commit the `.env` file.

## Run the Test

Tests run on five platforms (projects in `playwright.config.js`):

| Project | Browser | Notes |
|---|---|---|
| `windows-chrome` | Google Chrome | real Chrome installed on the machine |
| `windows-firefox` | Firefox | Playwright's Firefox build |
| `mac-safari` | WebKit (Safari engine) | Desktop Safari settings; not the real Safari app |
| `iphone-17-safari` | WebKit (Safari engine) | emulated iPhone 17: screen, touch, mobile user agent |
| `android-galaxy-s24-chrome` | Chromium | emulated Samsung Galaxy S24: screen, touch, mobile user agent |

Run the functional tests on all platforms:

```bash
npm test
```

Run on one platform, for example Chrome with a visible browser:

```bash
npx playwright test --project=windows-chrome --headed
```

Mobile and Safari projects are emulated: they use Playwright's WebKit/Chromium builds with the
device's screen size, touch, and user agent, not real devices or the real Safari app.

## View the HTML Report

```bash
npx playwright show-report
```

Keep the report server running while viewing the report.

## Allure Report

Run the functional tests and generate the Allure report (old results are removed first);
for the accessibility checks use `npm run test:a11y:allure`:

```bash
npm run test:allure
```

Pass Playwright options after `--`, for example:

```bash
npm run test:allure -- --project=windows-chrome
```

Open the generated report in the browser:

```bash
npm run allure:open
```

Keep the report server running while viewing the report; press `Ctrl+C` to stop it.

## Accessibility Checks

`tests/accessibility.spec.js` checks the key pages against WCAG 2.2 levels A and AA using axe-core
(`@axe-core/playwright`): Home, Login, New Article editor, Article page with a comment, and Profile.

The checks are soft: each test runs to the end, all violations are added to the report, and the test
is marked failed if any violations were found. For each page the report contains:

- the soft assertion message with one line per violation: impact, rule, WCAG criterion, and the number of elements;
- the `Accessibility: <page>` attachment with a readable description of each violation:
  why it matters, a link to more information, and for each element its selector, HTML, and how to fix it;
- the `Accessibility (JSON): <page>` attachment with the full axe-core results.

The accessibility tests are tagged `@a11y` and run separately from the functional tests:

| Command | What it runs |
|---|---|
| `npm test` | functional tests only (without `@a11y`) |
| `npm run test:a11y` | accessibility checks only |
| `npm run test:all` | everything |
| `npm run test:allure` | functional tests + Allure report |
| `npm run test:a11y:allure` | accessibility checks + Allure report |

## Current Limitations

- `create-article.spec.js` does not delete the article it creates; one article is left on the site per run.
  Articles created by the other tests are deleted by the `publishedArticle` fixture.
- The website is shared, and all tests use one test account. New articles from other users and from
  parallel tests can move the test article to another page; tests handle this by searching all pages
  of article lists.
- `mac-safari`, `iphone-17-safari`, and `android-galaxy-s24-chrome` are emulated with Playwright's
  WebKit and Chromium builds, not the real Safari app or real devices.
- The accessibility checks currently fail because the website has WCAG violations; this is expected.
  Functional tests (`npm test`) do not include them.