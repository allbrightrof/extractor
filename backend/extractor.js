const { chromium } = require('playwright');

async function extractM3U8(url) {
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    let foundM3U8 = null;

    page.on('request', (request) => {
      const reqUrl = request.url();
      if (reqUrl.includes('.m3u8') && !foundM3U8) {
        foundM3U8 = reqUrl;
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(7000);

    return foundM3U8;
  } catch (err) {
    console.error('Extractor error:', err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { extractM3U8 };
