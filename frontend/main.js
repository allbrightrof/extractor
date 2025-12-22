const btn = document.getElementById('extractBtn');
const input = document.getElementById('urlInput');
const result = document.getElementById('result');

btn.addEventListener('click', async () => {
  const url = input.value.trim();

  if (!url) {
    result.textContent = '❌ Please enter a URL';
    return;
  }

  result.textContent = '⏳ Extracting...';

  try {
    const res = await fetch('http://localhost:3000/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (!data.success) {
      result.textContent = '❌ ' + data.message;
      return;
    }

    result.innerHTML = data.streams
      .map(s => `✅ <strong>${s.type}</strong><br><small>${s.url}</small><br><br>`)
      .join('');
  } catch (err) {
    result.textContent = '❌ Extraction failed: ' + err.message;
  }
});
