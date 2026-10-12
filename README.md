# Universal video repo (flat)

Renders a timed promo video from HTML + CSS + JS + SVG with Playwright (Chromium) and FFmpeg inside GitHub Actions.
Two themes: `infographic` (1080x1920) and `podcast` (1920x1080). Everything is read at run time from `timestamps.txt` and your assets.

## Make a video (phone only)
1. Upload ALL files to the main folder (Add file -> Upload files). Create `.github/workflows/render.yml` with Add file -> Create new file (type the full path).
2. Actions -> Render Video -> Run workflow -> theme -> quality `preview`, then `full`. Download the video from Artifacts.
3. Another video: replace `timestamps.txt` and the assets (logo, audio, badge, fonts). Keep `project.json` fields at `auto`. Regenerate `scenes.json` or set it to `[]` to use the automatic classifier.

## Where to edit what
- Texts, timing, mood: `timestamps.txt` (`start | end | text | mood`, names wrapped in the two quote markers are highlighted).
- Detected values and overrides: `project.json` (host look is only in `project.json` -> `host`).
- Per-line design (cards, numbers, icons): `scenes.json` (labels must be exact parts of the line; a stale `match` is ignored with a warning).
- Official store badge: `google-play-badge.png` (get others at https://developer.android.com/distribute/tools/promote/badges, Apple: its marketing resources page). Never drawn by this repo.

## File map
- Entry: `index-infographic.html`, `index-podcast.html` (thin shells), `render.js`, `package.json`, `timestamps.txt`, `project.json`, `scenes.json`
- tool-env.js env defaults | tool-browser.js page, init, fit, frame loop | tool-encoder.js FFmpeg | tool-audio.js probe, envelope, mux | tool-assets.js asset scan, badge crop | tool-fonts.js font checks | tool-check-repo.js static checks | tool-test-seek.js seek and universality test | tool-test-duration.js duration tests
- common-tokens.css palette variables and fonts | common-easing.js | common-detect.js | common-palette.js | common-parse.js | common-timeline.js | common-text-segment.js
- common-numbers.js, common-numbers-lang.js (data), common-keywords.js (data), common-classify.js | common-icons-core.js, common-icons-topic.js, common-icon-map.js (data), common-icon-assign.js
- common-audio-level.js | common-background.js | common-caption.js | common-logo.js | common-store-badge.js | common-scenes.js | common-layout-fit.js
- Theme A: a-layout.css, a-logo-motion.js, a-main.js. Theme B: b-layout.css, b-studio.js, b-logo-motion.js, b-main.js, b-host-config.js, b-host-svg.js, b-host-anim.js
- `.github/workflows/render.yml` (the only file in a sub-folder)

## Timing
Total = max(audio + tail, last scene end + 0.5 s). Audio plays once, never loops, and is padded with silence. The last scene stays visible to the end. Lip movement follows word timing and loudness; exact lip-sync would need phoneme data.

## Icons (79, original SVG, defined once in a hidden defs block, no emoji)
crescent, mosque, dome, minaret, cube-shrine, compass, prayer-beads, clock, sun, moon, lantern, star8, floral, diamond, knot, book, open-book, library-shelf, scroll, pen, magnifier, phone, download-arrow, globe, heart, open-hand, microphone, headphones, speaker, play-arrow, video-frame, document, list, grid, bookmark, name-tag, map-pin, shield, ring-check, lightbulb, gear, bell, calendar, bar-chart, share, link, house, key, leaf, water-drop, flame, tree, mountain, cloud, wifi, battery, lock, envelope, chat-bubble, camera, music-note, cart, wallet, coin, trophy, medal, graduation-cap, rocket, wrench, truck, building, plus-badge, line-chart, target, puzzle, clipboard, folder, qr-code, hourglass.
Meaning keywords for matching are in `common-icon-map.js` (English + Bengali; add a language by adding a table).

## Known limits
Spelled-out numbers are supported for Bengali and English (digits of any script work in every language); add a table in `common-numbers-lang.js` for more.
