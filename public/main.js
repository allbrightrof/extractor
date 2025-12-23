async function extract() {
  const url = document.getElementById('urlInput').value.trim();
  const output = document.getElementById('output');

  if (!url) {
    output.textContent = '❌ Please enter a URL';
    return;
  }

  output.textContent = '⏳ Extracting...';

  try {
    const res = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!data.success) {
      output.textContent = `❌ ${data.message || data.error}`;
      return;
    }

    output.textContent =
      `✅ Found ${data.count} link(s):\n\n` +
      data.links.join('\n');
  } catch (err) {
    output.textContent = '❌ Request failed';
  }
}
