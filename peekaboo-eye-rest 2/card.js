// The reminder card: loads a GIF from GIPHY and runs the rest countdown.

const $ = (id) => document.getElementById(id);

const query = new URLSearchParams(location.search);
const standalone = query.get("standalone") === "1"; // shown in its own small window
if (query.get("v") === "top") document.body.classList.add("top");
if (standalone) document.body.classList.add("standalone");

function closeCard() {
  if (standalone) window.close();
  else chrome.runtime.sendMessage({ type: "close" });
}

async function loadGif(s) {
  const chosen = PEEKABOO_ANIMALS.filter((a) => s.animals.includes(a.id));
  const animal = (chosen.length ? chosen : PEEKABOO_ANIMALS)[Math.floor(Math.random() * (chosen.length || PEEKABOO_ANIMALS.length))];

  if (!s.giphyKey) {
    $("gifMsg").textContent = "Add your GIPHY key in Peekaboo's settings to see animals here.";
    return;
  }
  try {
    const params = new URLSearchParams({
      api_key: s.giphyKey,
      q: animal.search,
      limit: "25",
      offset: String(Math.floor(Math.random() * 50)),
      rating: "g",       // family-friendly results only
      lang: "en"
    });
    const res = await fetch(`https://api.giphy.com/v1/gifs/search?${params}`);
    if (!res.ok) throw new Error(`GIPHY ${res.status}`);
    const { data } = await res.json();
    if (!data || !data.length) throw new Error("No results");

    const gif = data[Math.floor(Math.random() * data.length)];
    const img = gif.images.fixed_height || gif.images.original;
    const el = $("gif");
    el.alt = gif.title || `A cute ${animal.label.toLowerCase()} GIF`;
    el.onload = () => { el.classList.add("loaded"); $("gifMsg").hidden = true; };
    el.onerror = () => { $("gifMsg").textContent = "Couldn't load the GIF. Rest your eyes anyway!"; };
    el.src = img.webp || img.url;
  } catch (err) {
    $("gifMsg").textContent = "Couldn't reach GIPHY. Rest your eyes anyway!";
  }
}

function finish(title, text, closeAfterMs) {
  clearInterval(timer);
  $("resting").hidden = true;
  $("finished").hidden = false;
  $("doneTitle").textContent = title;
  $("doneText").textContent = text;
  setTimeout(closeCard, closeAfterMs);
}

let timer;

chrome.storage.sync.get(PEEKABOO_DEFAULTS).then((s) => {
  loadGif(s);

  const total = s.restSeconds;
  let left = total;
  $("secs").textContent = left;

  timer = setInterval(() => {
    left -= 1;
    $("secs").textContent = Math.max(left, 0);
    $("bar").style.width = `${Math.max(0, (left / total) * 100)}%`;
    if (left <= 0) finish("Nice work!", "Your eyes thank you.", 2500);
  }, 1000);

  $("done").addEventListener("click", () => finish("Nice work!", "Your eyes thank you.", 1200));
  $("snooze").addEventListener("click", () => {
    clearInterval(timer);
    $("resting").hidden = true;
    $("finished").hidden = false;
    $("doneTitle").textContent = "See you in 5 minutes";
    $("doneText").textContent = "Peekaboo will pop back soon.";
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: "snooze" });
      if (standalone) window.close();
    }, 1200);
  });
});
