## Project Structure

```
├── tests/                    # test scenarios and assertions
├── pages/                    # page objects: locators and actions
│   ├── LoginPage.js
│   ├── NewArticlePage.js     # article editor: create and edit
│   ├── ArticleDetailsPage.js # article page: title, body, comments
│   ├── ProfilePage.js        # My Articles, Favorited Articles
│   ├── HomePage.js           # Global Feed
│   └── ArticlePreview.js     # article card and article list with pagination search
├── utils/
│   └── api.js                # API helpers: delete a test article
├── fixtures.js               # page objects, publishedArticle, articlesToDelete
├── playwright.config.js      # Chrome, baseURL, HTML report, .env check
└── .env                      # test account credentials (not in Git)
```
