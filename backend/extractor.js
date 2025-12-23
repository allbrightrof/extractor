const { chromium } = require('playwright');

async function extractM3U8(url) {
  // Add --no-sandbox for Render
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  let foundM3U8 = null;

  page.on('request', (request) => {
    const reqUrl = request.url();
    if (reqUrl.includes('.m3u8') && !foundM3U8) {
      foundM3U8 = reqUrl;
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(5000); // wait for JS players
  } catch (e) {
    console.warn('Page load failed:', e.message);
  }

  await browser.close();
  return foundM3U8;
}

module.exports = { extractM3U8 };
