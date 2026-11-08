const $ = (id) => document.getElementById(id);

const LIMITS = {
  intervalMinutes: { min: 5, max: 120, step: 5 },
  restSeconds: { min: 5, max: 120, step: 5 }
};
const CORNER_NAMES = {
  "top-left": "Top left", "top-right": "Top right",
  "bottom-left": "Bottom left", "bottom-right": "Bottom right"
};

let settings = { ...PEEKABOO_DEFAULTS };

const save = (patch) => {
  settings = { ...settings, ...patch };
  render();
  return chrome.storage.sync.set(patch);
};

async function renderStatus() {
  const el = $("status");
  el.classList.toggle("paused", !settings.enabled);
  if (!settings.enabled) {
    $("statusText").textContent = "Paused. No animals until you switch back on";
    return;
  }
  // Give the background a moment to reschedule after a change.
  await new Promise((r) => setTimeout(r, 150));
  const alarms = await chrome.alarms.getAll();
  const next = alarms.filter((a) => a.name.startsWith("eye-rest")).map((a) => a.scheduledTime).sort((a, b) => a - b)[0];
  $("statusText").textContent = next
    ? `Next peek at ${new Date(next).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
    : `Next peek in ${settings.intervalMinutes} min`;
}

function render() {
  $("enabled").checked = settings.enabled;
  $("sections").classList.toggle("disabled", !settings.enabled);
  $("intervalMinutes").textContent = settings.intervalMinutes;
  $("restSeconds").textContent = settings.restSeconds;
  $("cornerLabel").textContent = CORNER_NAMES[settings.corner] || "Bottom right";

  document.querySelectorAll("#chips button").forEach((b) => {
    b.setAttribute("aria-pressed", String(settings.animals.includes(b.dataset.animal)));
  });
  document.querySelectorAll("#corners button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.corner === settings.corner));
  });
  renderStatus();
}

// Build the animal chips
PEEKABOO_ANIMALS.forEach((a) => {
  const b = document.createElement("button");
  b.textContent = a.label;
  b.dataset.animal = a.id;
  b.addEventListener("click", () => {
    const has = settings.animals.includes(a.id);
    const next = has ? settings.animals.filter((x) => x !== a.id) : [...settings.animals, a.id];
    if (next.length) save({ animals: next }); // always keep at least one
  });
  $("chips").appendChild(b);
});

$("enabled").addEventListener("change", (e) => save({ enabled: e.target.checked }));

document.querySelectorAll("[data-step]").forEach((b) => {
  b.addEventListener("click", () => {
    const key = b.dataset.step;
    const { min, max, step } = LIMITS[key];
    const value = Math.min(max, Math.max(min, settings[key] + step * Number(b.dataset.dir)));
    if (value !== settings[key]) save({ [key]: value });
  });
});

document.querySelectorAll("#corners button").forEach((b) => {
  b.addEventListener("click", () => save({ corner: b.dataset.corner }));
});

$("preview").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "preview" }).catch(() => {});
  setTimeout(() => window.close(), 150); // get the popup out of the way so you can see the card
});

$("keyToggle").addEventListener("click", () => {
  const box = $("keyBox");
  box.hidden = !box.hidden;
  $("keyToggle").setAttribute("aria-expanded", String(!box.hidden));
  if (!box.hidden) $("giphyKey").focus();
});
$("keySave").addEventListener("click", async () => {
  await save({ giphyKey: $("giphyKey").value.trim() });
  $("keySave").textContent = "Saved";
  setTimeout(() => ($("keySave").textContent = "Save"), 1200);
});

chrome.storage.sync.get(PEEKABOO_DEFAULTS).then((s) => {
  // Older versions stored a single "animal"; the new list replaces it.
  if (!Array.isArray(s.animals) || !s.animals.length) s.animals = PEEKABOO_DEFAULTS.animals;
  settings = s;
  $("giphyKey").value = s.giphyKey || "";
  if (!s.giphyKey) { // no key yet: open the key box so it's easy to add one
    $("keyBox").hidden = false;
    $("keyToggle").setAttribute("aria-expanded", "true");
  }
  render();
});
