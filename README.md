# ইসলামী বিশ্বকোষ ও আল হাদিস S2 — video renderer

A GitHub Actions video renderer for both vertical infographic (9:16) and landscape podcast (16:9) themes. Runs in GitHub Actions; no local PC setup is required.

## Phone-only workflow
1. Create a GitHub repository.
2. Upload every root file in this ZIP to the repository root. Keep the supplied logo, audio, Google Play badge and `timestamps.txt` in the root.
3. Create `.github/workflows/render.yml` with **Add file → Create new file** if your upload method did not include it.
4. Open **Actions → Render Video → Run workflow**, choose theme and preview first; choose full for final quality.
5. Download `video` from the workflow run's Artifacts.

## Edit for another video
Replace `timestamps.txt` and the root assets. Update `project.json` as needed. `scenes.json` is optional metadata; use `{}` to allow runtime classification. Keep exact text in timestamp lines.

## File map (all files are in root except workflow)
- `index-infographic.html`, `a-layout.css`, `a-main.js`, `a-logo-motion.js`: vertical theme.
- `index-podcast.html`, `b-layout.css`, `b-main.js`, `b-studio.js`, `b-host-config.js`, `b-host-svg.js`, `b-host-anim.js`, `b-logo-motion.js`: landscape theme and original presenter illustration.
- `common-*.js`, `common-tokens.css`: shared parsing, styling and scene helpers.
- `tool-*.js`, `render.js`: validation and rendering.
- `timestamps.txt`, `project.json`, `scenes.json`: project data.
- `logo.png`, `google-play-badge.png`, `audio.mp3`: your project assets.
- `.github/workflows/render.yml`: GitHub Actions workflow.

## Icon list / originality
The shared helper library currently names these vector concepts: crescent (Islamic motif), book (reading), diamond (ornament), mosque (worship), heart (care), globe (world), compass (Qibla/navigation), clock (prayer timing), shield (protection). The current scene renderer uses CSS ornaments and supplied official store badge; it does not recreate the Google Play badge. This starter implementation does **not** yet implement the full 79-icon SVG `<symbol>` library or full karaoke word-level timing from the master specification.

## Audio and duration
Detected audio duration: 56.640 s. Last timestamp ends at 56.000 s. With 2.000 s tail, output duration is 58.640 s (the audio is longer than the final timestamp by 0.640 s). The audio is muxed once and padded with silence to the video duration.

## Verification status
The generated repository includes a basic JS/JSON checker and duration unit test. These checks have not been executed in a GitHub Actions runner here; a real Chromium render, ffmpeg mux validation, full icon uniqueness scan, all synthetic universality tests, and visual frame inspection are **not verified**. Bengali font download depends on network access during the workflow; upload `SolaimanLipi-Regular.ttf` in the root if download fails. Exact lip-sync would require phoneme data.
