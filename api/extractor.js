export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();

    const patterns = [
      /\.m3u8(\?[^"' ]*)?/gi,
      /\.mp4(\?[^"' ]*)?/gi,
      /\.webm(\?[^"' ]*)?/gi,
      /\.mpd(\?[^"' ]*)?/gi,
    ];

    const found = new Set();

    patterns.forEach((regex) => {
      const matches = html.match(regex);
      if (matches) {
        matches.forEach((m) => found.add(m));
      }
    });

    if (found.size === 0) {
      return res.json({
        success: false,
        message: 'No media links found on this page',
      });
    }

    return res.json({
      success: true,
      count: found.size,
      links: Array.from(found),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Extraction failed',
      details: err.message,
    });
  }
}
