# Universal Video Repo Builder

Renders timed promo / explainer videos from HTML + CSS + JS + SVG using Playwright (Chromium) + FFmpeg inside GitHub Actions.

## Themes
- **podcast** (16:9, 1920×1080) – illustrated host in a studio
- **infographic** (9:16, 1080×1920) – logo + cards + caption panel

## File map (flat root)
| File | Purpose |
|------|---------|
| timestamps.txt | Scene timings and text |
| project.json | Detected / override values (theme, brand, colors, host look…) |
| scenes.json | Optional human-editable scene visual plan |
| render.js | Entry point |
| tool-*.js | Render tooling (env, browser, encoder, audio, assets…) |
| common-*.js / .css | Shared logic, styles, icons |
| a-*.js / .css | Theme A (infographic) |
| b-*.js / .css | Theme B (podcast) + host SVG |
| index-*.html | Thin shells |
| .github/workflows/render.yml | GitHub Actions workflow |
| logo.png, audio.mp3, google-play-badge.png, *.ttf | Your assets (never overwritten) |

## Phone steps
1. Create a new public GitHub repo.
2. Upload **all** files from this package to the **root** of the repo (Add file → Upload files). Upload in batches if needed. Do **not** create folders except the workflow path.
3. Create the workflow: Add file → Create new file → type exactly `.github/workflows/render.yml` and paste the content.
4. Upload your logo, audio, badge and any font files to the root as well.
5. Go to **Actions → Render Video → Run workflow**. Choose theme (podcast / infographic / both) and quality (preview first).
6. Download the video from the Artifacts section when the run finishes.

## How to make another video
- Replace `timestamps.txt` and the asset files (logo, audio, badge).
- Set fields in `project.json` to `"auto"` or edit them.
- Regenerate or delete `scenes.json` to use the automatic classifier.
- Re-run the workflow. No code changes needed.

## Host look (theme B)
Edit the `host` object inside `project.json` (skin, hair, beard, glasses, clothes, etc.).

## Duration rule
With audio: video ends `endPad` seconds (default 2.0) after the audio ends, and never before the last scene is complete.
