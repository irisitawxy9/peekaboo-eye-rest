// Peekaboo Eye Rest — background service worker
// Keeps the reminder schedule and puts the card on the page you're looking at.
importScripts("shared.js");

const MAIN_ALARM = "eye-rest";
const SNOOZE_ALARM = "eye-rest-snooze";
const SNOOZE_MINUTES = 5;

const getSettings = () => chrome.storage.sync.get(PEEKABOO_DEFAULTS);

function updateBadge(enabled) {
  chrome.action.setBadgeText({ text: enabled ? "" : "OFF" });
  chrome.action.setBadgeBackgroundColor({ color: "#6E665B" });
}

// (Re)create the repeating alarm from the saved settings.
async function schedule() {
  const s = await getSettings();
  await chrome.alarms.clear(MAIN_ALARM);
  await chrome.alarms.clear(SNOOZE_ALARM);
  if (s.enabled) {
    await chrome.alarms.create(MAIN_ALARM, {
      delayInMinutes: s.intervalMinutes,
      periodInMinutes: s.intervalMinutes
    });
  }
  updateBadge(s.enabled);
}

async function showReminder({ force = false } = {}) {
  const s = await getSettings();
  if (!s.enabled && !force) return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab || !tab.id) throw new Error("No active tab");
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (corner) => window.__peekabooShow(corner),
      args: [s.corner]
    });
  } catch (err) {
    // Chrome blocks extensions on some pages (new tab, chrome:// pages, the Web Store),
    // so show the card in its own small window in the chosen corner instead.
    await showInWindow(s);
  }
}

async function showInWindow(s) {
  const W = 344, H = 480;
  const url = chrome.runtime.getURL("card.html?standalone=1");
  let bounds = {};
  try {
    const win = await chrome.windows.getLastFocused();
    if (win && win.left != null) {
      bounds.left = s.corner.endsWith("right") ? win.left + win.width - W - 16 : win.left + 16;
      bounds.top = s.corner.startsWith("bottom") ? win.top + win.height - H - 16 : win.top + 80;
    }
  } catch (e) {}
  try {
    await chrome.windows.create({ url, type: "popup", width: W, height: H, focused: true, ...bounds });
  } catch (e) {
    try {
      await chrome.windows.create({ url, type: "popup", width: W, height: H, focused: true });
    } catch (e2) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Time to rest your eyes",
        message: `Look at something about 20 feet away for ${s.restSeconds} seconds.`,
        priority: 1
      });
    }
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.sync.set(await getSettings()); // fill in any missing defaults
  await schedule();
});

chrome.runtime.onStartup.addListener(schedule);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && (changes.enabled || changes.intervalMinutes)) schedule();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === MAIN_ALARM || alarm.name === SNOOZE_ALARM) showReminder();
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.type === "preview") {
    showReminder({ force: true });
  } else if (msg?.type === "snooze") {
    chrome.alarms.create(SNOOZE_ALARM, { delayInMinutes: SNOOZE_MINUTES });
  }
  // The card asks to be closed; tell the page it lives on.
  if ((msg?.type === "snooze" || msg?.type === "close") && sender.tab?.id) {
    chrome.tabs.sendMessage(sender.tab.id, { type: "peekaboo-close" }).catch(() => {});
  }
});
