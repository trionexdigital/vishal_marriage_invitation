# Vishal & Vishakha · Wedding invitation

A complete, buildless invitation website. All photographs, fonts, the intro video, and artwork are served locally. No accounts, database, external music streams, or RSVP backend are required.

## Run

With Node.js on your PATH, run `npm start` from this folder, then open **http://127.0.0.1:8765**. No installation is needed.

On this device, Node is also available at:

```powershell
& 'C:\Users\SHUAIB\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' server.mjs
```

Stop the server with Ctrl+C. Use `PORT` to choose a different port. The preview binds only to this computer. Serve over HTTP; opening `index.html` directly as a file cannot run JavaScript modules reliably.

## Edit the invitation

Edit **config.js** for names, blessing, dates, event details, venue address, map destination, photographs, and the future `publicUrl`. All timed dates use India's `+05:30` offset. The countdown targets midnight at the beginning of 4 December, not the 6 PM baraat departure. The calendar event is an all-day wedding reminder.

The HTML also contains the original complete invitation so it stays readable without JavaScript. If you change the names, dates, or event copy, update that fallback text in **index.html** as well. `styles.css` controls the layout and animation. `app.js` supplies the interactions. `domain.js` contains date, calendar, and sharing logic.

The opening is shown once per browser-tab session. Reloading the same tab skips the door sequence. A new tab without a section hash shows it again. Music is gesture-started, pauses in a hidden tab, and remembers the guest's mute preference. To replay the entrance in the same tab, clear this site's session storage or use a new browser session.

## Supplied and generated media

Originals in `assets/images/` and `assets/videos/` are unchanged. Optimized web copies, local fonts, generated art, and the social-sharing image are in `assets/web/`. The silent portrait video is the functional entrance, not a separate movie section.

The Windows image preparation helpers require Pillow. They are for rebuilding assets, not for running the site:

- `scripts/prepare_assets.py`: download verified venue photos and fonts, create responsive web copies.
- `scripts/finish_artwork.py`: compress generated PNGs and create the sharing preview.

Sources and the exact image-generation prompts are documented in **ASSET-SOURCES.md**. Generate new artwork with the built-in imagegen tool before rerunning the artwork helper.

## Verify

Run `npm test` (or `node --test tests/domain.test.mjs`). Tests check Indian midnight, countdown expiry, all-day calendar boundaries, line folding, and safe sharing of local previews.

Browser checks and screenshots are recorded in **VALIDATION.md** and `screenshots/`.

## Hosting later

Run `npm run package` (or `node scripts/package.mjs`) to refresh **dist/**, a complete static copy with optimized media and no originals or development files. Deploy the contents of that folder to any static HTTPS host. No Node server is needed on the host. Set `publicUrl` to the final HTTPS URL, ending in `/`, before packaging; the packager writes absolute social metadata into HTML for sharing crawlers, and the app includes the public link in sharing. The social-preview JPG contains the initial names/date; regenerate it after changing those details. Website hosting is intentionally deferred.
