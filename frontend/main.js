const btn = document.getElementById("extractBtn");
const input = document.getElementById("urlInput");
const output = document.getElementById("output");

btn.onclick = async () => {
  const url = input.value.trim();

  if (!url) {
    output.textContent = "❌ Please enter a URL";
    return;
  }

  output.textContent = "⏳ Extracting...";

  try {
    const res = await fetch(
      "https://extractor-llap.onrender.com/extract",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }
    );

    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = "❌ Request failed";
  }
};
