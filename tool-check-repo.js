'use strict';
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = fs.readdirSync(root).filter(f => {
  try { return fs.statSync(path.join(root, f)).isFile(); } catch { return false; }
});

console.log('[check] files in root:', files.length);

// Flat check – only .github allowed as dir
const dirs = fs.readdirSync(root).filter(f => {
  try { return fs.statSync(path.join(root, f)).isDirectory() && f !== 'node_modules' && f !== '.git'; } catch { return false; }
});
const badDirs = dirs.filter(d => d !== '.github');
if (badDirs.length) {
  console.error('[check] FAIL: unexpected directories:', badDirs);
  process.exit(1);
}
console.log('[check] flat structure OK');

// Required files
const required = ['render.js', 'package.json', 'timestamps.txt', 'project.json',
  'index-podcast.html', 'index-infographic.html', 'common-easing.js', 'common-parse.js',
  'common-timeline.js', 'b-main.js', 'a-main.js'];
for (const r of required) {
  if (!fs.existsSync(path.join(root, r))) {
    console.error('[check] missing required:', r);
    process.exit(1);
  }
}
console.log('[check] required files present');

// Emoji scan (simple)
const emojiRe = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u;
let emojiHits = 0;
for (const f of files) {
  if (!/\.(js|css|html|json|yml|md)$/.test(f)) continue;
  if (f === 'timestamps.txt') continue;
  const txt = fs.readFileSync(path.join(root, f), 'utf8');
  if (emojiRe.test(txt)) {
    console.warn('[check] possible emoji in', f);
    emojiHits++;
  }
}
console.log('[check] emoji scan done, hits=', emojiHits);
console.log('[check] OK');
