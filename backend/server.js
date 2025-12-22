const express = require('express');
const cors = require('cors');
const extractStream = require('./extractor');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/extract', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: 'No URL provided'
    });
  }

  try {
    const result = await extractStream(url);

    if (!result.found) {
      return res.json({
        success: false,
        message: 'No supported media streams found on this page.'
      });
    }

    res.json({
      success: true,
      count: result.streams.length,
      streams: result.streams
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Extraction failed'
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
