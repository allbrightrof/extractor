app.post('/extract', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.json({ error: 'URL is required' });
    }

    const m3u8 = await extractM3U8(url);

    if (!m3u8) {
      return res.json({ error: 'No m3u8 found' });
    }

    return res.json({ m3u8 });
  } catch (err) {
    console.error('Server error:', err.message);
    return res.json({ error: 'Internal server error' });
  }
});
