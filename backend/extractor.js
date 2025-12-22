const { chromium } = require('playwright');

async function extractStream(targetUrl) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const detectedStreams = new Map();

  function detectStream(url) {
    const lower = url.toLowerCase();

    if (lower.includes('.m3u8')) return 'HLS (.m3u8)';
    if (lower.includes('.mp4')) return 'MP4 (.mp4)';
    if (lower.includes('.webm')) return 'WEBM (.webm)';
    if (lower.includes('.mpd')) return 'DASH / DRM (.mpd)';

    return null;
  }

  page.on('request', request => {
    const url = request.url();
    const type = detectStream(url);

    if (!type) return;

    if (!detectedStreams.has(url)) {
      detectedStreams.set(url, type);
      console.log(`🎯 Detected ${type}: ${url}`);
    }
  });

  try {
    await page.goto(targetUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Try to trigger video playback
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });

    // Wait a bit for streams to load
    await page.waitForTimeout(5000);
  } catch (err) {
    console.error('❌ Page error:', err.message);
  }

  await browser.close();

  return {
    found: detectedStreams.size > 0,
    streams: Array.from(detectedStreams.entries()).map(([url, type]) => ({
      url,
      type
    }))
  };
}

module.exports = extractStream;
