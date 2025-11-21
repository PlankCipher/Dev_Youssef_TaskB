import express, { NextFunction, Request, Response } from 'express';
import puppeteer from 'puppeteer';

const app = express();

const isValidURL = (req: Request, res: Response, next: NextFunction): Response | void => {
  const urlQuery = req.query.url;

  // Missing URL
  if (!urlQuery) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const url = new URL(urlQuery as string);

    // Not an HTTP URL
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return res.status(400).json({ error: 'Invalid URL' });
    }
  } catch (_) {
    // Invalid URL
    return res.status(400).json({ error: 'Invalid URL' });
  }

  return next();
}

const MAX_TIMEOUT = 20 * 1000;

app.get('/api/scrape', isValidURL, async (req: Request, res: Response, next: NextFunction) => {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    page.setDefaultTimeout(MAX_TIMEOUT);

    if (req.query.ua) {
      await page.setUserAgent({ userAgent: req.query.ua as string });
    }

    await page.goto(req.query.url as string);
    await page.waitForNetworkIdle();

    const title = await page.title();

    // Gracefully handle elements that are not found by using the Page.$()
    // method, null checks, and having a default fallback value instead of
    // using the Page.$eval() method and crashing the entire process if an
    // element is not found.
    let metaDescription = '';
    const metaHandle = await page.$('head > meta[name="description"]');
    if (metaHandle) {
      metaDescription = await page.evaluate(
        (metaEl: HTMLMetaElement) => metaEl.content,
        metaHandle
      );
    }

    let h1 = '';
    const h1Handle = await page.$('h1');
    if (h1Handle) {
      h1 = await page.evaluate(
        (h1El: HTMLHeadingElement) => h1El.innerText,
        h1Handle
      );
    }

    return res.status(200).json({
      title,
      metaDescription,
      h1,
      status: 200,
    });
  } catch (err) {
    if ((err as Error).name === 'TimeoutError') {
      return res.status(504).json({ error: 'Timeout' });
    }

    next(err);
  } finally {
    // I think it's better if we handle errors in a try-catch here
    // instead of later in the general error handler middleware so
    // that we have a chance to gracefully close the browser in most
    // of the cases/crashes.
    if (browser) {
      return await browser.close();
    }
  }
});

// app.get('/', async (_req: Request, res: Response) => {
//   const delay = 3 * 1000;
//   await (new Promise(resolve => setTimeout(resolve, delay)));
//   res.send(`<h1>Waited for ${delay}ms</h1>`);
// });

app.use((_err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Server Error' });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
