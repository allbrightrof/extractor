document.getElementById('extractBtn').onclick = async () => {
  const url = document.getElementById('urlInput').value.trim();
  const resultDiv = document.getElementById('result');

  if (!url) {
    resultDiv.textContent = 'Please enter a valid URL.';
    return;
  }

  resultDiv.textContent = '⏳ Extracting...';

  try {
    const response = await fetch('https://extractor-llap.onrender.com/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    // Get raw text first
    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      resultDiv.textContent = '❌ Backend returned invalid or empty response';
      return;
    }

    // Check if m3u8 exists
    if (data.m3u8) {
      resultDiv.textContent = '✅ M3U8 Found: ' + data.m3u8;
      navigator.clipboard.writeText(data.m3u8).catch(() => {});
    } else {
      resultDiv.textContent = '❌ ' + (data.error || 'Unknown error');
    }
  } catch (e) {
    resultDiv.textContent = '❌ Extraction failed: ' + e.message;
  }
};
