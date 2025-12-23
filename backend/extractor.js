const { chromium } = require('playwright');

async function extractM3U8(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let foundM3U8 = null;

  // Listen for all network requests
  page.on('request', (request) => {
    const reqUrl = request.url();
    if (reqUrl.includes('.m3u8') && !foundM3U8) {
      foundM3U8 = reqUrl;
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });

    // Wait a few seconds for JS players to load
    await page.waitForTimeout(5000);
  } catch (e) {
    console.warn('Page load failed:', e.message);
  }

  await browser.close();
  return foundM3U8; // null if not found
}

module.exports = { extractM3U8 };
