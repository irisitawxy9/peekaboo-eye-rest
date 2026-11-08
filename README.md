# Peekaboo Eye Rest

A cute animal GIF peeks out from the corner of your screen when it's time to rest your eyes
(the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds).

## Install (free, about 2 minutes)
1. Unzip this folder somewhere permanent (e.g. Documents). Chrome loads it from there, so don't delete it.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `peekaboo-eye-rest` folder (the one with `manifest.json` inside).
5. Click the puzzle-piece icon in the toolbar and pin **Peekaboo Eye Rest**.

Updating from an older version: on `chrome://extensions`, click **Remove** on the old Peekaboo,
then Load unpacked the new folder.

## Use
Click the toolbar icon to:
- switch reminders on/off (the icon shows "OFF" when paused)
- set how often (5–120 min) and how long to rest (5–120 sec)
- pick which animals can show up, and which corner
- **Preview now** to test it
- **GIPHY key** to change the API key

On pages where Chrome blocks extensions (new tab page, `chrome://` pages, Chrome Web Store),
the card opens in its own small window instead.

## GIFs
GIFs come from GIPHY's free API (100 requests/hour; one reminder uses one request), G-rated only.
Your API key is saved in `shared.js` and in Chrome's settings for this extension.
Don't post this folder publicly with the key in it.

## Change something later
Edit the files, then click the reload button on the extension's card in `chrome://extensions`.
- Colours: `theme.css`
- Animals and their GIPHY searches: `PEEKABOO_ANIMALS` in `shared.js`
- Card wording: `card.html`
- Snooze length: `SNOOZE_MINUTES` in `background.js`

## Privacy
Settings stay in Chrome. The only thing sent anywhere is the GIF search (e.g. "cute otter") to GIPHY.
Chrome warns that the extension can "read and change data on all websites" only because it has to
show the card on whatever page you're on.

Font: Nunito (SIL Open Font License, see `fonts/OFL-LICENSE.txt`).
