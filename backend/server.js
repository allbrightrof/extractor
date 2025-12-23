const express = require('express');
const cors = require('cors');
const { extractM3U8 } = require('./extractor');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/extract', async (req, res) => {
  const { url } = req.body;

  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const m3u8Link = await extractM3U8(url);

    if (m3u8Link) {
      return res.json({ m3u8: m3u8Link });
    } else {
      return res.json({ error: 'No m3u8 found on this page' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Extraction failed' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
