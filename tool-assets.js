'use strict';
/**
 * tool-assets.js – Scan root for logo, badge, fonts, audio; ignore reserved repo files
 */
const fs = require('fs');
const path = require('path');

const RESERVED = new Set([
  'index-infographic.html', 'index-podcast.html', 'render.js', 'package.json',
  'timestamps.txt', 'README.md', 'project.json', 'scenes.json',
  'tool-env.js', 'tool-browser.js', 'tool-encoder.js', 'tool-audio.js',
  'tool-assets.js', 'tool-fonts.js', 'tool-check-repo.js', 'tool-test-seek.js',
  'tool-test-duration.js',
  'common-tokens.css', 'common-easing.js', 'common-detect.js', 'common-palette.js',
  'common-parse.js', 'common-timeline.js', 'common-text-segment.js',
  'common-numbers.js', 'common-numbers-lang.js', 'common-keywords.js',
  'common-classify.js', 'common-icons-core.js', 'common-icons-topic.js',
  'common-icon-map.js', 'common-icon-assign.js', 'common-audio-level.js',
  'common-background.js', 'common-caption.js', 'common-logo.js',
  'common-store-badge.js', 'common-scenes.js', 'common-layout-fit.js',
  'a-layout.css', 'a-logo-motion.js', 'a-main.js',
  'b-layout.css', 'b-studio.js', 'b-logo-motion.js', 'b-main.js',
  'b-host-config.js', 'b-host-svg.js', 'b-host-anim.js',
  'package-lock.json', 'node_modules'
]);

function isReserved(name) {
  if (RESERVED.has(name)) return true;
  if (name.startsWith('.')) return true;
  if (name.endsWith('.md') && name !== 'README.md') return false;
  return false;
}

function scanAssets(root) {
  const files = fs.readdirSync(root).filter(f => {
    try {
      return fs.statSync(path.join(root, f)).isFile() && !isReserved(f);
    } catch (_) { return false; }
  });

  let logo = null;
  let badge = null;
  let audio = null;
  const fonts = [];
  const extras = [];

  for (const f of files) {
    const lower = f.toLowerCase();
    const ext = path.extname(lower);
    if (['.mp3', '.wav', '.m4a', '.aac'].includes(ext)) {
      audio = f;
    } else if (['.ttf', '.otf', '.woff', '.woff2'].includes(ext)) {
      fonts.push(f);
    } else if (lower.includes('badge') || lower.includes('google-play') || lower.includes('app-store') || lower.includes('play-store')) {
      badge = f;
    } else if (lower.includes('logo') || lower === 'logo.png' || lower === 'logo.jpg' || lower === 'logo.webp' || lower === 'logo.svg') {
      logo = f;
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext)) {
      if (!logo && (lower.includes('logo') || lower.includes('icon'))) logo = f;
      else extras.push(f);
    }
  }

  // Prefer explicit logo.png if present
  if (files.includes('logo.png')) logo = 'logo.png';
  if (files.includes('google-play-badge.png')) badge = 'google-play-badge.png';

  return { logo, badge, audio, fonts, extras, all: files };
}

function loadLogoDataUrl(root, logoFile) {
  if (!logoFile) return null;
  const p = path.join(root, logoFile);
  if (!fs.existsSync(p)) return null;
  const buf = fs.readFileSync(p);
  const ext = path.extname(logoFile).toLowerCase().replace('.', '');
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  return `data:${mime};base64,${buf.toString('base64')}`;
}

module.exports = { scanAssets, loadLogoDataUrl, RESERVED };
