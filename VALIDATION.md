# Validation record

Checked locally in the Codex in-app Chromium browser. The finished preview is served at http://127.0.0.1:8765. Hosting has not been performed.

## Layout

| Requested viewport width | Available content width | Invitation width | Horizontal overflow |
| --- | --- | --- | --- |
| 320 px | 305 px | 305 px | None |
| 390 px | 375 px | 375 px | None |
| 768 px | 753 px | 560 px | None |
| 1440 px | 1425 px | 560 px | None |

The browser reserves 15 px for its scrollbar. Names and ornaments were visually reviewed at narrow widths. The DJ illustration originally overlapped its description; it now occupies a separate grid column. The corrected card was reviewed again at mobile width.

## Verified behavior

- Supplied door video plays through once (about 10.2 seconds) and transitions to the invitation. Skip closes the entrance and releases scroll lock. Returning sessions bypass it.
- A temporary fixture with a missing video source reached the invitation automatically. A missing venue illustration fell back to the authentic entrance photograph. Temporary fixture files were removed.
- Date reveal works through the accessible button with pointer activation and Enter. The revealed date remains available after reload. The canvas supports pointer capture and normalized stroke retention across resizing.
- Gallery arrows change the photograph. Lightbox arrow keys navigate; Escape closes it and focus returns to the original gallery control. Authentic venue photographs open in the same accessible viewer.
- Music starts following interaction; the control reports playing, then paused after another activation. A reload no longer requires two clicks to start music.
- Save the Date downloaded `Vishal-and-Vishakha-2026-12-04.ics`. Its contents use all-day December 4–5 boundaries, escaped/folded text, and no invented ceremony time.
- Copy invitation details opens the dialog and successfully copies the confirmed schedule. Localhost is omitted. The native share path is available to supported browsers; no invitation was sent to another person during QA.
- Maps points to a Google Maps search containing the resort name and complete Shamli address.
- With the enhancement script removed in an isolated fixture, every invitation section remains visible and the date coating stays hidden.
- Page console error/warning collection was empty on the normal invitation.

## Automated checks

`node --test tests/domain.test.mjs`: **4 passed, 0 failed**. These cover Indian midnight, India date rollover, nonnegative/expired countdowns, all-day calendar boundaries and line folding, and exclusion of private/local URLs from sharing. `node --check app.js` passed. The static package contains 37 files, approximately 8.9 MB, including the video and local fonts.

## Scope of verification

This is a desktop Chromium check with responsive viewports, not a physical iPhone/Android test. Hardware touch scratching/swiping, Safari playback, and device-specific share sheets were not exercised. Reduced-motion CSS and the hidden-tab audio suspension code were reviewed; the host's accessibility preference was not changed. A slow full-page screenshot refresh failed in the browser capture API; final individual screenshots are retained instead.

## Screenshots and records

- `screenshots/desktop-hero.jpg`
- `screenshots/mobile-320-hero.jpg`
- `screenshots/mobile-390-hero.jpg`
- `screenshots/tablet-768-hero.jpg`
- `screenshots/opening-doors.jpg` (initial fallback poster while video data loads)
- `screenshots/dj-mobile.jpg` (corrected illustration spacing)
- `screenshots/venue-mobile.jpg`
- `screenshots/final-preview.jpg`
- `screenshots/browser-checks.json` and `responsive-checks.json`

The preview remains running. Run and editing instructions are in README.md; artwork provenance and generation prompts are in ASSET-SOURCES.md.
