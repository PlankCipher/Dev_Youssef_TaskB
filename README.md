# Task A: Mini Scraper

## Setup Instructions

### Prerequisits

- Node.js >= 20
- NPM

### Starting the Server

To start the server, simply run `npm i && npm run dev`.

## Scripts

- `dev`: `npm run dev` starts the development server in watch mode

> [!IMPORTANT]
> The `dev` script assumes you have `Node.js` >= 20 as it uses the `--env-file` flag introduced in that version.

## API Endpoints

### `GET /api/scrape?url=...&ua=...`

Returns the `title`, `metaDescription` and first `h1` from the page referred to by `url`.

#### Params:

- `url`
  - The URL of the page to scrape.
  - Mandatory.
  - Must be a valid URL with a valid HTTP Scheme (`http://` or `https://`).

- `ua`
  - User Agent to use instead of the default one.
  - Optional.

#### Example Request and Response

```
GET /api/scrape?url=https://pptr.dev&ua=Puppeteer
```


```json
{
  "title": "Puppeteer | Puppeteer",
  "metaDescription": "build",
  "h1": "Puppeteer",
  "status": 200
}
```
