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
  - Mandatory.
  - The URL of the page to scrape.
  - Must be a valid URL with a valid HTTP Scheme (`http://` or `https://`).

- `ua`
  - Optional.
  - User Agent to use instead of the default one.

#### Examples

##### Successful Request

```
GET /api/scrape?url=https://pptr.dev&ua=Puppeteer
```

```json
200 Ok

{
  "title": "Puppeteer | Puppeteer",
  "metaDescription": "build",
  "h1": "Puppeteer",
  "status": 200
}
```

##### Successful Request, But the Page Misses Some Data

```
GET /api/scrape?url=https://www.google.com
```

```json
200 Ok

{
  "title": "Google",
  "metaDescription": "",
  "h1": "",
  "status": 200
}
```

##### Invalid or Missing URL

```
GET /api/scrape
```

```json
400 Bad Request

{
  "error": "Invalid URL"
}
```

##### Timeout

All requests timeout after 20 seconds.

```
GET /api/scrape?url=http://localhost:3000/api/scrape/
```

```json
504 Gateway Timeout

{
  "error": "Timeout"
}
```

> [!NOTE]
> You can simulate page loading timeout with a mock endpoint similar to this:
>
> ```js
> app.get('/', async (_req: Request, res: Response) => {
>   const delay = 3 * 1000;
>   await (new Promise(resolve => setTimeout(resolve, delay)));
>   res.send(`<h1>Waited for ${delay}ms</h1>`);
> });
> ```
>
> As a matter of fact, I've left this endpoint commented out in `src/index.ts` for your testing.
