import { chromium } from 'playwright';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const links = await page.evaluate(() => {
      const seen = new Set();
      const result = [];

      // Detect <video> tags and <source>
      document.querySelectorAll('video').forEach(video => {
        if (video.src && !seen.has(video.src)) {
          seen.add(video.src);
          result.push(video.src);
        }
        video.querySelectorAll('source').forEach(source => {
          if (source.src && !seen.has(source.src)) {
            seen.add(source.src);
            result.push(source.src);
          }
        });
      });

      // Detect network requests via performance API
      const xhrLinks = Array.from(window.performance.getEntriesByType('resource'))
        .map(r => r.name)
        .filter(n => n.match(/\.(m3u8|mp4|webm|mpd)(\?|$)/i));

      xhrLinks.forEach(l => {
        if (!seen.has(l)) {
          seen.add(l);
          result.push(l);
        }
      });

      return result;
    });

    await browser.close();

    if (!links.length) {
      return res.status(200).json({ message: 'No media links found on this page.' });
    }

    return res.status(200).json({ links });

  } catch (err) {
    if (browser) await browser.close();
    console.error(err);
    return res.status(500).json({ error: 'Extraction failed.', details: err.message });
  }
}
