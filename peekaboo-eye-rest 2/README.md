# Peekaboo Eye Rest 🐰

A free Chrome extension that pops a cute animal GIF into a corner of your screen when it's time to rest your eyes.

It's built around the **20-20-20 rule**: every 20 minutes, look at something about 20 feet away for 20 seconds. Peekaboo times the break for you, and you can change both numbers.

**Version:** 2.0.2 · **Cost:** free · **Works in:** Google Chrome on Mac, Windows and Linux

---

## Features

- **Animal GIFs:** each reminder shows a random G-rated GIF from GIPHY of an animal you picked.
- **Your rhythm:** choose how often it reminds you (5–120 minutes) and how long you rest (5–120 seconds).
- **Pick your animals:** cats, puppies, bunnies, pandas, otters, red pandas, hamsters and penguins, as many as you like.
- **Pick your corner:** top left, top right, bottom left or bottom right.
- **Countdown:** a progress bar counts down your rest, then the card says "Nice work!" and slides away.
- **Snooze:** "Snooze 5 min" brings the card back five minutes later.
- **On/off switch:** pause reminders any time. The toolbar icon shows **OFF** while paused.
- **Works on Chrome's own pages:** on pages where extensions can't draw (new tab, `chrome://` pages, the Chrome Web Store), the card opens in its own small window instead.

---

## Install (about 2 minutes)

1. **Unzip** `peekaboo-eye-rest.zip` into a folder you'll keep, such as Documents. Chrome runs the extension from this folder, so don't delete or move it.
2. In Chrome, go to `chrome://extensions`.
3. Turn on **Developer mode** with the switch in the top-right corner.
4. Click **Load unpacked** and choose the `peekaboo-eye-rest` folder (the one with `manifest.json` directly inside).
5. Click the puzzle-piece icon in Chrome's toolbar and **pin** Peekaboo Eye Rest so the bunny is always visible.
6. Click the bunny and paste your free GIPHY API key into the **GIPHY key** box at the bottom, then click **Save**. See [GIPHY API key](#giphy-api-key) for how to get one.
7. Open any normal website, click the bunny and press **Preview now** to check it works.

When you install it, Chrome warns that the extension can "read and change all your data on all websites." See [Privacy and permissions](#privacy-and-permissions) for why it needs this.

### Updating to a new version
1. Unzip the new version over your existing `peekaboo-eye-rest` folder.
2. Go to `chrome://extensions` and click the ↻ reload icon on the Peekaboo card.

If Chrome shows an error after updating from version 1, click **Remove** on Peekaboo, then **Load unpacked** the folder again.

---

## Using it

Click the bunny in the toolbar to open the settings:

| Setting | What it does |
|---|---|
| **On/off switch** (top right) | Turns reminders on or off. While on, the status bar shows when the next reminder is due. |
| **Remind me every** | Time between reminders, in 5-minute steps (5–120 min). |
| **Rest for** | Length of the countdown, in 5-second steps (5–120 sec). |
| **Who peeks** | Animals that can appear. Tap to pick or unpick; at least one stays picked. |
| **Where** | Click a corner on the mini screen to choose where the card appears. |
| **Preview now** | Shows a reminder straight away. |
| **GIPHY key** | Shows a box for viewing or changing your GIPHY API key. |

Changes save automatically. If you're signed in to Chrome with sync turned on, your settings follow you to Chrome on your other computers (the extension itself still has to be installed on each one).

When a reminder appears:
- **I'm rested** closes the card.
- **Snooze 5 min** hides it and brings it back five minutes later.
- Or just rest. When the countdown ends, the card closes by itself.

---

## GIPHY API key

The GIFs come from GIPHY's free API, which needs a key. This copy doesn't include one, so add your own (it's free). Until you do, the card still appears and counts down, but shows a message where the GIF would be.

- **The free key is limited to 100 requests per hour.** Each reminder uses one request, so even a reminder every 5 minutes uses only 12 an hour.
- **Getting a key:** sign in at developers.giphy.com, open your Dashboard, click **Create an API Key** and choose **API** (not SDK). Give it a name and short description, then copy the key.
- **Adding it:** click the bunny, paste the key into **GIPHY key** at the bottom of the popup and click **Save**.
- **Where it's stored:** a key you paste into the popup is saved in Chrome's settings, not in these files, so this folder is safe to share. If you type a key into `shared.js` instead, don't share the folder.
- **Attribution:** GIPHY's terms require the "Powered by GIPHY" label shown on the card.

---

## Troubleshooting

**Nothing happens when I click Preview now.**
Reload the extension at `chrome://extensions` (↻ icon) and try again on a normal website. If you're on a Chrome page like the new tab, a small Peekaboo window should open instead. Check whether it opened behind your main Chrome window.

**The card says "Couldn't reach GIPHY."**
Check your internet connection. If you changed the key, check it was pasted correctly with no extra spaces. If you've hit the 100-requests-per-hour limit, it resets within the hour. You can still rest your eyes while the card counts down.

**A reminder didn't show up.**
Reminders only run while Chrome is open, and not while your computer is asleep. Also check that the switch is on and that the toolbar icon doesn't say **OFF**.

**The toolbar still shows the old icon.**
Unpin and re-pin the extension, or restart Chrome.

**The card covers something I need.**
Click **Snooze 5 min**, or choose a different corner in settings.

---

## Customizing

After editing any file, click ↻ reload on the extension's card at `chrome://extensions`.

| To change… | Edit |
|---|---|
| Colours | `theme.css` (the palette is at the top) |
| Animals, their names in the popup, and what's searched on GIPHY | `PEEKABOO_ANIMALS` in `shared.js` |
| Default settings (and an optional built-in GIPHY key) | `PEEKABOO_DEFAULTS` in `shared.js` |
| Card wording ("Time to rest your eyes" etc.) | `card.html` and `card.js` |
| Snooze length | `SNOOZE_MINUTES` in `background.js` |
| Toolbar icon | the PNGs in `icons/` (16, 32, 48 and 128 px) |

### What each file does

| File | Role |
|---|---|
| `manifest.json` | Tells Chrome the extension's name, version, permissions and files. |
| `background.js` | Keeps the reminder schedule, handles snooze and decides where to show the card. |
| `content.js` | Slides the card into the corner of the page you're on. |
| `card.html`, `card.css`, `card.js` | The reminder card: fetches the GIF and runs the countdown. |
| `popup.html`, `popup.css`, `popup.js` | The settings popup you open from the toolbar. |
| `shared.js` | Defaults, the GIPHY key and the animal list, shared by all of the above. |
| `theme.css` | Colours and font. |
| `fonts/` | The Nunito font files and their licence. |
| `icons/` | The bunny toolbar icon. |

---

## Privacy and permissions

Peekaboo has no account, no tracking and no server of its own. Your settings stay in Chrome. The only thing it sends anywhere is the GIF search (for example "cute otter") to GIPHY, along with your API key.

| Permission | Why it's needed |
|---|---|
| Read and change data on all websites | To show the card on whatever page you're viewing. Peekaboo doesn't read page content. |
| Alarms | To time your reminders. |
| Storage | To save your settings. |
| Scripting | To place the card on the current page. |
| Notifications | A last-resort fallback if the card can't open at all. |

---

## Cost

Everything here is free:
- Loading the extension yourself with **Load unpacked** doesn't need the Chrome Web Store, so there's no developer fee. (Publishing it on the Web Store would need a one-time $5 developer registration, which you only need if you want to share it with other people.)
- The GIPHY key is GIPHY's free key, and Peekaboo stays well under its limit.
- The Nunito font is free under the SIL Open Font License.

---

## Credits

- GIFs: [GIPHY](https://giphy.com)
- Font: Nunito by Vernon Adams, Cyreal and Jacques Le Bailly, SIL Open Font License (`fonts/OFL-LICENSE.txt`)
- Bunny icon and design: made for Peekaboo
