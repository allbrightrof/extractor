const extractBtn = document.getElementById('extract-btn');
const urlInput = document.getElementById('url-input');
const linksContainer = document.getElementById('links-container');

function createLinkEntry(url) {
  const div = document.createElement('div');
  div.className = 'url-entry';
  
  const a = document.createElement('a');
  a.href = url;
  a.textContent = url;
  a.target = '_blank';
  
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '📋 Copy';
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(url).then(() => alert('Copied!'));
  };

  div.appendChild(a);
  div.appendChild(copyBtn);
  return div;
}

extractBtn.onclick = async () => {
  linksContainer.innerHTML = 'Extracting...';
  try {
    const response = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput.value })
    });

    const data = await response.json();
    linksContainer.innerHTML = '';

    if (data.links && data.links.length > 0) {
      data.links.forEach(link => {
        linksContainer.appendChild(createLinkEntry(link));
      });
    } else {
      linksContainer.textContent = data.message || data.error || 'No links found';
    }
  } catch (err) {
    linksContainer.textContent = 'Extraction failed';
    console.error(err);
  }
};
